import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Iniciando seed…')

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'filosofia' },
      update: {},
      create: { name: 'Filosofia', slug: 'filosofia' },
    }),
    prisma.category.upsert({
      where: { slug: 'historia' },
      update: {},
      create: { name: 'História', slug: 'historia' },
    }),
    prisma.category.upsert({
      where: { slug: 'politica' },
      update: {},
      create: { name: 'Política', slug: 'politica' },
    }),
    prisma.category.upsert({
      where: { slug: 'literatura' },
      update: {},
      create: { name: 'Literatura', slug: 'literatura' },
    }),
    prisma.category.upsert({
      where: { slug: 'ciencia' },
      update: {},
      create: { name: 'Ciência', slug: 'ciencia' },
    }),
  ])

  console.log('✓ Categorias criadas')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@defacto.com' },
    update: {},
    create: {
      name: 'Administrador De Facto',
      email: 'admin@defacto.com',
      password: adminPassword,
      role: 'ADMIN',
      slug: 'administrador',
      bio: 'Administrador da plataforma editorial De Facto.',
    },
  })

  // Writer user
  const writerPassword = await bcrypt.hash('escritor123', 12)
  const writer = await prisma.user.upsert({
    where: { email: 'escritor@defacto.com' },
    update: {},
    create: {
      name: 'Marcus Aurelius',
      email: 'escritor@defacto.com',
      password: writerPassword,
      role: 'WRITER',
      slug: 'marcus-aurelius',
      bio: 'Filósofo, ensaísta e membro fundador da comunidade De Facto. Interessa-se pela interseção entre pensamento clássico e contemporâneo.',
    },
  })

  console.log('✓ Usuários criados')
  console.log('  Admin: admin@defacto.com / admin123')
  console.log('  Escritor: escritor@defacto.com / escritor123')

  // Sample article
  await prisma.article.upsert({
    where: { slug: 'sobre-a-natureza-do-conhecimento' },
    update: {},
    create: {
      title: 'Sobre a Natureza do Conhecimento',
      subtitle: 'Uma reflexão acerca dos limites da epistemologia moderna',
      slug: 'sobre-a-natureza-do-conhecimento',
      body: `<p>O conhecimento humano, desde os gregos, tem sido objeto de profunda investigação filosófica. Platão, em sua alegoria da caverna, nos presenteou com uma das metáforas mais duradouras da história do pensamento ocidental: a imagem de homens acorrentados, incapazes de perceber a realidade além das sombras projetadas na parede.</p>

<h2>O Problema do Ceticismo</h2>

<p>Descartes, séculos mais tarde, retomou essa questão com sua dúvida metódica. Ao questionar tudo aquilo que poderia ser posto em dúvida, buscava encontrar um fundamento inabalável para o conhecimento humano. <em>Cogito, ergo sum</em> — penso, logo existo — tornou-se a pedra angular de seu sistema filosófico.</p>

<blockquote>A primeira regra era de nunca aceitar como verdadeira nenhuma coisa que eu não conhecesse evidentemente como tal. — Descartes, Discurso do Método</blockquote>

<h2>Epistemologia Contemporânea</h2>

<p>No século XX, a filosofia da linguagem veio transformar radicalmente nossa compreensão do problema. Wittgenstein, em suas <em>Investigações Filosóficas</em>, argumentou que o significado não é uma entidade mental privada, mas emerge do uso público da linguagem em formas de vida compartilhadas.</p>

<p>Esta perspectiva tem implicações profundas para nossa compreensão do que significa "saber" algo. O conhecimento não é apenas uma relação entre um sujeito e um objeto, mas um fenômeno essencialmente social e linguístico.</p>

<h2>Conclusão</h2>

<p>A questão do conhecimento permanece tão urgente quanto sempre foi. Em uma era de desinformação e relativismo epistêmico, retornar às questões fundamentais da epistemologia não é um exercício de erudição vazia — é uma necessidade prática e política.</p>`,
      excerpt:
        'Uma investigação sobre os fundamentos do conhecimento humano, da caverna de Platão ao giro linguístico contemporâneo.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      categoryId: categories[0].id,
      authorId: writer.id,
      readTime: 6,
    },
  })

  console.log('✓ Artigo de exemplo criado')
  console.log('\n🎉 Seed concluído com sucesso!')
}

main()
  .catch(e => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
