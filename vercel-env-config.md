# Configuração de Variáveis de Ambiente no Vercel

## Variáveis Obrigatórias

### Supabase
- `SUPABASE_URL` - URL do seu projeto Supabase
- `SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase (para operações admin)

### OpenAI
- `OPENAI_API_KEY` - Chave da API OpenAI para GPT-4

### PubMed (Opcional)
- `PUBMED_API_KEY` - Chave da API PubMed (NCBI E-Utilities)

### D-ID (Opcional - para Avatar Animado)
- `DID_API_KEY` - Chave da API D-ID para avatar animado

## Como Configurar no Vercel

1. Acesse o dashboard do Vercel
2. Vá para seu projeto
3. Clique em "Settings" → "Environment Variables"
4. Adicione cada variável acima com seus respectivos valores

## Valores de Exemplo

```bash
SUPABASE_URL=https://rfjshppjhjtwtbqhlaio.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-...
PUBMED_API_KEY=your-pubmed-api-key
DID_API_KEY=your-did-api-key
```

## Notas Importantes

- **D-ID API Key**: Necessária apenas se quiser usar o avatar animado
- **PubMed API Key**: Necessária apenas se quiser usar a busca de artigos científicos
- Todas as outras variáveis são **obrigatórias** para o funcionamento básico
