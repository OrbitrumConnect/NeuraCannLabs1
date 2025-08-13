# 🔧 CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE - VERCEL

## 📋 Variáveis Necessárias para o Deploy

Configure estas variáveis no dashboard do Vercel (Settings > Environment Variables):

### 🗄️ Supabase (Já configurado)
```
DATABASE_URL=postgresql://postgres:[SENHA]@rfjshppjhjtwtbqhlaio.supabase.co:5432/postgres
SUPABASE_URL=https://rfjshppjhjtwtbqhlaio.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanNocHBqaGp0d3RicWhsYWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjk2MjAsImV4cCI6MjA3MDY0NTYyMH0.zN4bYUDnFB7l43HaFRgyJ_Jv2R-XDYVH_rDpQFEO634
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### 🔐 Session (Obrigatório)
```
SESSION_SECRET=super_secret_key_32_chars_minimum_for_production
```

### 🤖 OpenAI (Obrigatório)
```
OPENAI_API_KEY=sua_openai_api_key_aqui
```

### 🎭 D-ID (Opcional - Avatar Animado)
```
DID_API_KEY=sua_did_api_key_aqui
```

### 🎵 ElevenLabs (Opcional - Síntese de Voz)
```
ELEVENLABS_API_KEY=sua_elevenlabs_api_key_aqui
```

### 🌍 Production
```
NODE_ENV=production
REPLIT_DOMAINS=neurocann-lab.vercel.app
```

## 🚀 Próximos Passos

1. **Acesse o Vercel**: https://vercel.com
2. **Importe o projeto**: Conecte com o GitHub
3. **Configure as variáveis**: Cole as configurações acima
4. **Deploy**: Clique em Deploy!

## 📊 Status do Projeto

✅ **GitHub**: Configurado e sincronizado  
✅ **Supabase**: Credenciais fornecidas  
🔄 **Vercel**: Próximo passo  
🔄 **OpenAI**: Configurar API Key  
🔄 **Deploy**: Finalizar configuração
