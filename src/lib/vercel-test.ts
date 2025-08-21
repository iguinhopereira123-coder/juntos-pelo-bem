// Teste específico para Vercel
// Para verificar se a integração PIX está funcionando

import { pushinPay } from './pushynpay-integration';
import { isVercelEnvironment, getApiKey } from './vercel-config';

export async function testVercelIntegration() {
  console.log('🧪 Testando integração Vercel...\n');

  // Verificar ambiente
  const isVercel = isVercelEnvironment();
  console.log(`📍 Ambiente Vercel: ${isVercel ? '✅ SIM' : '❌ NÃO'}`);
  console.log(`🌐 Hostname: ${typeof window !== 'undefined' ? window.location.hostname : 'SSR'}`);
  console.log(`🔑 API Key: ${getApiKey().substring(0, 10)}...`);

  // Testar geração de PIX
  console.log('\n📱 Gerando PIX de teste...');
  
  try {
    const pix = await pushinPay.generatePix({
      amount: 10.00,
      description: 'Teste Vercel - Integração PIX',
      customerName: 'Teste Vercel',
      customerEmail: 'teste@vercel.com',
      customerComment: 'Teste de integração na Vercel'
    });

    console.log('✅ PIX gerado com sucesso:');
    console.log(`   📊 ID: ${pix.transactionId}`);
    console.log(`   💰 Valor: R$ ${pix.amount}`);
    console.log(`   📱 QR Code: ${pix.pixQrCode ? '✅ Disponível' : '❌ Não disponível'}`);
    console.log(`   🔑 Chave: ${pix.pixKey}`);
    console.log(`   📋 Código: ${pix.copyPasteCode ? '✅ Disponível' : '❌ Não disponível'}`);
    console.log(`   ⏰ Expira: ${pix.expiresAt}`);
    console.log(`   📊 Status: ${pix.status}`);

    return pix;

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return null;
  }
}

// Teste de conectividade com PushinPay
export async function testPushinPayConnectivity() {
  console.log('\n🌐 Testando conectividade PushinPay...\n');

  try {
    const response = await fetch('https://api.pushinpay.com/v1/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getApiKey()}`,
        'X-API-Version': '2024-01-01',
      },
      mode: 'cors',
      credentials: 'omit'
    });

    console.log(`📡 Status: ${response.status}`);
    console.log(`📡 OK: ${response.ok ? '✅ SIM' : '❌ NÃO'}`);

    if (response.ok) {
      const data = await response.json();
      console.log('📊 Resposta:', data);
    }

    return response.ok;

  } catch (error) {
    console.error('❌ Erro de conectividade:', error);
    return false;
  }
}

// Teste completo
export async function runVercelTests() {
  console.log('🚀 Iniciando testes Vercel...\n');

  // Teste 1: Conectividade
  const connectivity = await testPushinPayConnectivity();
  
  // Teste 2: Integração
  const integration = await testVercelIntegration();

  console.log('\n📋 Resumo dos Testes:');
  console.log(`   🌐 Conectividade: ${connectivity ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`   📱 Integração: ${integration ? '✅ OK' : '❌ FALHOU'}`);

  return {
    connectivity,
    integration,
    success: connectivity && integration !== null
  };
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  (window as any).vercelTest = {
    testIntegration: testVercelIntegration,
    testConnectivity: testPushinPayConnectivity,
    runTests: runVercelTests
  };
  
  console.log('🧪 Testes Vercel disponíveis no console:');
  console.log('   window.vercelTest.testIntegration() - Testar integração');
  console.log('   window.vercelTest.testConnectivity() - Testar conectividade');
  console.log('   window.vercelTest.runTests() - Executar todos os testes');
}
