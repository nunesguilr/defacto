import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify, estimateReadTime } from '@/lib/utils'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Não autenticado.' }, { status: 401 })

  const role = (session.user as any).role
  if (role !== 'WRITER' && role !== 'ADMIN') {
    return Response.json({ error: 'Sem permissão.' }, { status: 403 })
  }

  try {
    const { title, subtitle, body, excerpt, coverImage, categoryId, tags, status } = await request.json()

    if (!title || !body || !categoryId) {
      return Response.json({ error: 'Título, corpo e categoria são obrigatórios.' }, { status: 400 })
    }

    // Generate unique slug
    let baseSlug = slugify(title)
    let slug = baseSlug
    let count = 0
    while (await prisma.article.findUnique({ where: { slug } })) {
      count++
      slug = `${baseSlug}-${count}`
    }

    // Estimate read time from plain text
    const plainText = body.replace(/<[^>]+>/g, ' ')
    const readTime = estimateReadTime(plainText)

    // Process tags
    const tagNames: string[] = tags
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : []

    const article = await prisma.article.create({
      data: {
        title,
        subtitle: subtitle || null,
        slug,
        body,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        categoryId,
        authorId: session.user!.id as string,
        status: status ?? 'DRAFT',
        readTime,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
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

    return Response.json(article, { status: 201 })
  } catch (error) {
    console.error('[POST /api/artigos]', error)
    return Response.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
