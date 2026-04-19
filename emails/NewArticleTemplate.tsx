import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Link,
  Heading,
  Hr,
  Preview
} from '@react-email/components';
import React from 'react';

// Valores de design mapeados das variáveis CSS globais (Paleta Humanista)
const colors = {
  parchment: '#F5EDD8',
  ink: '#1A1208',
  sepia: '#3B2A14',
  gold: '#C8A96E',
  crimson: '#8B1A1A',
};

interface NewArticleTemplateProps {
  title: string;
  excerpt: string;
  authorName: string;
  articleUrl: string;
  coverImage?: string;
}

export const NewArticleTemplate = ({
  title,
  excerpt,
  authorName,
  articleUrl,
  coverImage,
}: NewArticleTemplateProps) => (
  <Html>
    <Head>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');`}
      </style>
    </Head>
    <Preview>Novo Ensaio: {title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logo}>De Facto</Text>
          <Hr style={hrGold} />
        </Section>

        <Section style={content}>
          <Text style={subtitle}>Novo ensaio publicado por {authorName}</Text>
          <Heading style={h1}>{title}</Heading>
          
          {coverImage && (
            <Img
              src={coverImage}
              alt="Capa do artigo"
              width="100%"
              style={image}
            />
          )}

          <Text style={text}>{excerpt}</Text>

          <Section style={btnContainer}>
            <Link href={articleUrl} style={button}>
              Ler o Ensaio Completo
            </Link>
          </Section>
        </Section>

        <Section style={footer}>
          <Hr style={hr} />
          <Text style={footerText}>
            Você está recebendo este e-mail porque é membro da comunidade De Facto. 
            Acesse as configurações de sua conta para gerenciar assinaturas de newsletter.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#E8DCBE', // color-vellum
  fontFamily: "'EB Garamond', Garamond, 'Times New Roman', serif",
  padding: '40px 0',
};

const container = {
  backgroundColor: colors.parchment,
  border: `1px solid rgba(60, 42, 20, 0.18)`,
  borderRadius: '4px',
  margin: '0 auto',
  padding: '40px',
  maxWidth: '600px',
  boxShadow: '0 4px 16px rgba(26,18,8,0.12)',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '28px',
  fontWeight: '700',
  color: colors.ink,
  margin: '0 0 16px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
};

const hrGold = {
  borderColor: colors.gold,
  borderWidth: '1px',
};

const content = {
  paddingBottom: '20px',
};

const subtitle = {
  fontSize: '14px',
  color: colors.crimson,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  marginBottom: '16px',
};

const h1 = {
  fontFamily: "'Playfair Display', Georgia, serif",
  color: colors.ink,
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '1.2',
  marginBottom: '24px',
};

const image = {
  borderRadius: '4px',
  marginBottom: '24px',
};

const text = {
  color: colors.sepia,
  fontSize: '18px',
  lineHeight: '1.7',
  marginBottom: '32px',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const button = {
  backgroundColor: colors.crimson,
  borderRadius: '4px',
  color: colors.parchment,
  fontFamily: "'Inter', sans-serif",
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  padding: '12px 28px',
  display: 'inline-block',
};

const footer = {
  textAlign: 'center' as const,
};

const hr = {
  borderColor: 'rgba(60, 42, 20, 0.18)',
  margin: '32px 0 24px',
};

const footerText = {
  color: colors.sepia,
  fontSize: '12px',
  fontStyle: 'italic',
};

export default NewArticleTemplate;
