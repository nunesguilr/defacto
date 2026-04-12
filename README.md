# De Facto

De Facto é uma plataforma editorial e uma comunidade intelectual de cunho humanista, inspirada no design editorial da era Renascentista. O sistema oferece uma arquitetura robusta e escalável para a publicação, leitura e gerenciamento de artigos e produções intelectuais.

## 🏛️ Visão do Projeto
Uma plataforma de redação e visualização de artigos com uma estética humanista distinta:
- **Identidade Visual:** Tons de pergaminho, tipografia clássica com serifa, e ilustrações em estilo nanquim (ink-style).
- **Membros & Papéis:** Leitores, Membros Associados e Escritores (autores).

## ✨ Funcionalidades
- **Plataforma Editorial:** Escrita, edição, e publicação de artigos de alta qualidade.
- **Módulos do Sistema:**
  - Editor de Texto
  - Biblioteca de Referências
  - Dashboard Institucional
  - Gerenciamento da Comunidade
  - Criador de Gráficos e Planilhas Editoriais (Planejado)

## 🛠️ Tecnologias Utilizadas
- **Framework:** Next.js (App Router)
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Estilização:** CSS / Tailwind CSS adaptado para o Design System 
- **Linguagem:** TypeScript

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js (v18+)
- Banco de Dados PostgreSQL configurado e rodando

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/nunesguilr/defacto.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Renomeie o `.env.example` para `.env` e configure sua `DATABASE_URL`.

4. Realize a migração do banco de dados e insira os dados iniciais:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### 📖 Estética e Design 
O design da aplicação prioriza a excelência visual para criar um impacto "WOW", fornecendo uma sensação muito premium, interativa, e refinada, unindo a clássica tradição tipográfica com fluxos modernos de UI/UX.

## 📄 Licença
Todos os direitos reservados à comunidade De Facto - Sociedade Vera Cruz.
