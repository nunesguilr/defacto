import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify, estimateReadTime } from '@/lib/utils'
import { NextRequest } from 'next/server'
import { sendNewArticleNotification } from '@/lib/email'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Não autenticado.' }, { status: 401 })

  const { id } = await params

  const existing = await prisma.article.findUnique({ where: { id } })
  if (!existing) return Response.json({ error: 'Artigo não encontrado.' }, { status: 404 })
  if (existing.authorId !== (session.user!.id as string) && (session.user as any).role !== 'ADMIN') {
    return Response.json({ error: 'Sem permissão.' }, { status: 403 })
  }

  try {
    const { title, subtitle, body, excerpt, coverImage, categoryId, tags, status } = await request.json()

    const plainText = body?.replace(/<[^>]+>/g, ' ') ?? ''
    const readTime = body ? estimateReadTime(plainText) : existing.readTime

    const wasPublished = existing.status !== 'PUBLISHED' && status === 'PUBLISHED'

    // Handle tags
    const tagNames: string[] = tags
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : []

    // Delete old tags relation
    await prisma.articleTag.deleteMany({ where: { articleId: id } })

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title }),
        subtitle: subtitle ?? null,
        ...(body && { body }),
        excerpt: excerpt ?? null,
        coverImage: coverImage || null,
        ...(categoryId && { categoryId }),
        status: status ?? existing.status,
        readTime,
        publishedAt: wasPublished ? new Date() : existing.publishedAt,
        tags: {
          create: await Promise.all(
            tagNames.map(async name => {
              const tag = await prisma.tag.upsert({
                where: { name },
                create: { name },
                update: {},
              })
              return { tagId: tag.id }
            })
          ),
        },
      },
    })

    if (wasPublished) {
      sendNewArticleNotification(article.id).catch(err => 
        console.error('Failed to send email notification:', err)
      );
    }

    return Response.json(article)
  } catch (error) {
    console.error('[PATCH /api/artigos/:id]', error)
    return Response.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Não autenticado.' }, { status: 401 })

  const { id } = await params

  const existing = await prisma.article.findUnique({ where: { id } })
  if (!existing) return Response.json({ error: 'Não encontrado.' }, { status: 404 })
  if (existing.authorId !== (session.user!.id as string) && (session.user as any).role !== 'ADMIN') {
    return Response.json({ error: 'Sem permissão.' }, { status: 403 })
  }

  await prisma.article.delete({ where: { id } })
  return Response.json({ success: true })
}
