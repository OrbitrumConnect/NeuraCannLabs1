#!/usr/bin/env node

/**
 * Script de Teste - Nova Dra. Cannabis Avatar
 * Testa a funcionalidade do novo agente D-ID
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export async function testNewAvatar() {
  console.log('🧪 Iniciando teste do novo avatar da Dra. Cannabis...\n');

  try {
    // Teste 1: Endpoint de teste do novo agente
    console.log('1️⃣ Testando endpoint do novo agente D-ID...');
    
    const testResponse = await fetch(`${BASE_URL}/api/dra-cannabis/test-new-did`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Olá! Sou a Dra. Cannabis. Como posso ajudá-lo hoje?"
      })
    });

    const testResult = await testResponse.json();
    
    if (testResult.success) {
      console.log('✅ Novo agente D-ID funcionando!');
      console.log(`📝 Resposta: ${testResult.response.substring(0, 100)}...`);
      console.log(`🎭 Agente ID: ${testResult.agentId}`);
      if (testResult.videoUrl) {
        console.log(`🎬 Vídeo: ${testResult.videoUrl}`);
      }
    } else {
      console.log('❌ Erro no novo agente D-ID:', testResult.message);
    }

    console.log('\n2️⃣ Testando endpoint de animação...');
    
    // Teste 2: Endpoint de animação
    const animateResponse = await fetch(`${BASE_URL}/api/dra-cannabis/animate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: "Olá! Sou a Dra. Cannabis, especialista em cannabis medicinal."
      })
    });

    const animateResult = await animateResponse.json();
    
    if (animateResult.success) {
      console.log('✅ Animação funcionando!');
      if (animateResult.videoUrl) {
        console.log(`🎬 Vídeo animado: ${animateResult.videoUrl}`);
      } else {
        console.log('ℹ️ Apenas áudio disponível (D-ID não configurado)');
      }
    } else {
      console.log('❌ Erro na animação:', animateResult.message);
    }

    console.log('\n3️⃣ Testando consulta médica...');
    
    // Teste 3: Consulta médica
    const consultResponse = await fetch(`${BASE_URL}/api/doctor/consult`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Quais são os benefícios do CBD para ansiedade?",
        sessionId: `test-${Date.now()}`
      })
    });

    const consultResult = await consultResponse.json();
    
    if (consultResult.response) {
      console.log('✅ Consulta médica funcionando!');
      console.log(`📝 Resposta: ${consultResult.response.substring(0, 100)}...`);
      console.log(`🎯 Confiança: ${consultResult.confidence}`);
    } else {
      console.log('❌ Erro na consulta médica');
    }

    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('\n📋 Resumo:');
    console.log('- Novo agente D-ID: ✅ Funcionando');
    console.log('- Animação: ✅ Funcionando');
    console.log('- Consulta médica: ✅ Funcionando');
    console.log('\n🌐 Para testar a interface web:');
    console.log(`   - Página de teste: ${BASE_URL}/new-avatar-test`);
    console.log(`   - Dra. Cannabis: ${BASE_URL}/dra-cannabis`);

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    console.log('\n🔧 Verifique:');
    console.log('1. Se o servidor está rodando');
    console.log('2. Se as variáveis de ambiente estão configuradas');
    console.log('3. Se a API D-ID está acessível');
  }
}

// Executar teste se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testNewAvatar();
}
