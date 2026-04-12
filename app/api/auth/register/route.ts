import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { slugify } from '@/lib/utils'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return Response.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate unique slug
    let baseSlug = slugify(name)
    let slug = baseSlug
    let count = 0
    while (await prisma.user.findUnique({ where: { slug } })) {
      count++
      slug = `${baseSlug}-${count}`
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        slug,
        role: role === 'WRITER' ? 'WRITER' : 'MEMBER',
      },
    })

    return Response.json(
      { id: user.id, email: user.email, name: user.name, slug: user.slug },
      { status: 201 }
    )
  } catch (error) {
    console.error('[REGISTER]', error)
    return Response.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
