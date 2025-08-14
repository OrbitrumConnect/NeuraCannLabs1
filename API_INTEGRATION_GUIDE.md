# 🔬 Guia de Integração de APIs - NeuroCann Labs

## 📋 Visão Geral

O NeuroCann Labs agora integra duas APIs médicas oficiais para fornecer dados científicos em tempo real:

1. **PubMed (NCBI E-Utilities)** - Artigos científicos revisados por pares
2. **ClinicalTrials.gov API v2** - Ensaios clínicos e estudos

## 🚀 Funcionalidades Implementadas

### ✅ PubMed Integration
- **Busca dinâmica** de artigos científicos
- **Filtros automáticos** para cannabis medicinal
- **Paginação** com carregamento progressivo
- **Cache inteligente** para otimizar performance
- **Links diretos** para artigos originais

### ✅ ClinicalTrials.gov Integration
- **Busca por condição médica**
- **Filtros por fase** (Fase 1, 2, 3, 4)
- **Filtros por status** (Recrutando, Ativo, Concluído)
- **Informações detalhadas** de ensaios
- **Links diretos** para ClinicalTrials.gov

## 🔧 Configuração

### 1. PubMed API Key (Opcional)

Para melhor performance e limites mais altos:

1. Acesse: https://ncbiinsights.ncbi.nlm.nih.gov/2017/11/02/new-api-keys-for-the-e-utilities/
2. Crie uma conta NCBI
3. Solicite uma API Key
4. Configure no Vercel:

```bash
NEXT_PUBLIC_PUBMED_API_KEY=sua_chave_aqui
```

**Nota**: Sem a chave, a API funciona com limites reduzidos.

### 2. Variáveis de Ambiente

Configure no Vercel Dashboard:

```env
# PubMed (Opcional)
NEXT_PUBLIC_PUBMED_API_KEY=sua_chave_pubmed_aqui

# ClinicalTrials.gov (Não precisa de chave)
# Funciona automaticamente
```

## 📁 Estrutura dos Arquivos

```
client/src/
├── services/
│   ├── pubmedService.ts          # Serviço PubMed
│   └── clinicalTrialsService.ts  # Serviço ClinicalTrials.gov
├── hooks/
│   └── useBuscarDados.ts         # Hooks personalizados
└── pages/
    ├── ScientificDashboard.tsx   # Dashboard PubMed
    └── ClinicalDashboard.tsx     # Dashboard ClinicalTrials.gov
```

## 🎯 Como Usar

### ScientificDashboard (PubMed)
- **Aba "Artigos Recentes"**: Mostra os últimos artigos sobre cannabis
- **Aba "Resultados da Busca"**: Busca personalizada com paginação
- **Debounce**: Aguarda 500ms após digitar para buscar
- **Mínimo 3 caracteres** para iniciar busca

### ClinicalDashboard (ClinicalTrials.gov)
- **Aba "Recentes"**: Ensaios clínicos mais recentes
- **Aba "Busca"**: Busca por termo específico
- **Aba "Por Fase"**: Filtra por fase do ensaio
- **Aba "Por Status"**: Filtra por status atual

## 🔍 Exemplos de Busca

### PubMed
```
"cannabidiol epilepsy"     → Artigos sobre CBD e epilepsia
"THC pain management"      → Artigos sobre THC e dor
"cannabis anxiety"         → Artigos sobre cannabis e ansiedade
```

### ClinicalTrials.gov
```
"cannabis"                 → Todos os ensaios com cannabis
"epilepsy"                 → Ensaios para epilepsia
"chronic pain"             → Ensaios para dor crônica
```

## 🎨 Interface

### Cards de Artigos (PubMed)
- **Título** do artigo
- **Autores** (máximo 3 + contador)
- **Resumo** (truncado)
- **Revista** e data
- **Badges**: PubMed, DOI, Data
- **Botão**: "Ver Artigo" (abre em nova aba)

### Cards de Ensaios (ClinicalTrials.gov)
- **Título** do ensaio
- **Status** e fase
- **Condições** médicas
- **Intervenções** (medicamentos)
- **Datas** e número de participantes
- **Botão**: "Ver Ensaio" (abre em nova aba)

## ⚡ Performance

### Cache Strategy
- **PubMed**: 5 minutos (stale), 10 minutos (cache)
- **ClinicalTrials**: 5 minutos (stale), 10 minutos (cache)
- **Artigos recentes**: 10 minutos (stale), 30 minutos (cache)

### Rate Limiting
- **PubMed**: 100ms delay entre requisições
- **ClinicalTrials**: Sem delay (API pública)
- **Retry**: 2 tentativas com 1s de delay

## 🛠️ Troubleshooting

### Erro "Cannot find module"
```bash
npm install
npm run build
```

### Erro de API PubMed
1. Verifique a chave da API
2. Confirme limites de requisição
3. Teste em: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/

### Erro de API ClinicalTrials
1. Verifique conectividade
2. Teste em: https://clinicaltrials.gov/api/v2/studies

### Build Errors
```bash
# Limpar cache
rm -rf node_modules/.cache
npm run build
```

## 📊 Monitoramento

### Logs Importantes
- `Erro no serviço PubMed:` - Problemas com PubMed API
- `Erro no serviço ClinicalTrials.gov:` - Problemas com ClinicalTrials
- `Erro ao fazer parse do XML PubMed:` - Problemas de parsing

### Métricas
- **Tempo de resposta** das APIs
- **Taxa de sucesso** das requisições
- **Uso de cache** vs requisições diretas

## 🔄 Atualizações Futuras

### Planejadas
- [ ] **Filtros avançados** por data
- [ ] **Exportação** de resultados
- [ ] **Alertas** para novos estudos
- [ ] **Integração** com mais bases de dados
- [ ] **Análise de tendências** automática

### Melhorias
- [ ] **Cache offline** para artigos favoritos
- [ ] **Notificações** push para novos estudos
- [ ] **Comparação** entre estudos
- [ ] **Análise de impacto** dos estudos

## 📞 Suporte

Para problemas técnicos:
1. Verifique os logs do console
2. Teste as APIs diretamente
3. Confirme as variáveis de ambiente
4. Verifique a conectividade de rede

---

**🎯 NeuroCann Labs - Integração Completa de APIs Médicas**
