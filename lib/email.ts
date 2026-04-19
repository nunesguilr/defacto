import { Resend } from 'resend';
import { NewArticleTemplate } from '@/emails/NewArticleTemplate';
import { prisma } from './prisma';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_123456');

// We use an environment variable for the base URL to link from emails
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function sendNewArticleNotification(articleId: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY não configurada. Simulando envio para artigo:', articleId);
    return;
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { author: true },
    });

    if (!article) return;

    // Buscar todos os usuários marcados p/ receber newsletter
    const subscribers = await prisma.user.findMany({
      where: { newsletter: true },
      select: { email: true, name: true },
    });

    const subscriberEmails = subscribers.map(sub => sub.email);

    if (subscriberEmails.length === 0) return;

    const articleUrl = `${BASE_URL}/artigos/${article.slug}`;

    // Array de Bcc para evitar exposição de e-mails
    await resend.emails.send({
      from: 'De Facto <onboarding@resend.dev>', // Durante dev, você deve usar o e-mail verificado pela Resend, "onboarding@resend.dev" envia apenas para você mesmo se na free tier
      to: 'delivered@resend.dev', // Fallback address
      bcc: subscriberEmails,
      subject: `Novo Ensaio na De Facto: ${article.title}`,
      react: NewArticleTemplate({
        title: article.title,
        excerpt: article.excerpt || 'Um novo e instigante artigo acaba de ser publicado...',
        authorName: article.author.name,
        articleUrl: articleUrl,
        coverImage: article.coverImage || undefined,
      }),
    });

    console.log('[EMAIL] Notificação enviada com sucesso para', subscriberEmails.length, 'leitores.');
  } catch (error) {
    console.error('[EMAIL] Falha ao enviar e-mails de notificação:', error);
  }
}
