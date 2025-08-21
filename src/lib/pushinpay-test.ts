// Teste da integração PushinPay
// Execute este arquivo para verificar se a API está funcionando

import { pushinPay } from './pushynpay-integration';
import { PixAPI } from './pix-api';

export async function testPushinPayIntegration() {
  console.log('🧪 Iniciando testes da integração PushinPay...\n');

  try {
    // 1. Testar validação da API key
    console.log('1️⃣ Testando validação da API key...');
    const isValid = await PixAPI.validateApiKey();
    console.log(`   ✅ API Key válida: ${isValid}\n`);

    if (!isValid) {
      console.log('❌ API Key inválida. Verifique a configuração.');
      return false;
    }

    // 2. Testar geração de PIX
    console.log('2️⃣ Testando geração de PIX...');
    const testPix = await PixAPI.generatePix({
      amount: 10.00,
      description: 'Teste de integração PushinPay',
      customerName: 'Teste Usuário',
      customerEmail: 'teste@juntos-pelo-bem.com',
      customerComment: 'Teste de funcionalidade'
    });

    console.log(`   ✅ PIX gerado com sucesso!`);
    console.log(`   📊 Transaction ID: ${testPix.transactionId}`);
    console.log(`   💰 Valor: ${PixAPI.formatAmount(testPix.amount)}`);
    console.log(`   📱 Status: ${testPix.status}`);
    console.log(`   🔑 Chave PIX: ${testPix.pixKey}`);
    console.log(`   📋 Código copia e cola: ${testPix.copyPasteCode ? 'Disponível' : 'Não disponível'}\n`);

    // 3. Testar verificação de status
    console.log('3️⃣ Testando verificação de status...');
    const status = await PixAPI.checkPixStatus(testPix.transactionId);
    
    if (status) {
      console.log(`   ✅ Status verificado: ${status.status}`);
      console.log(`   📊 Valor: ${PixAPI.formatAmount(status.amount)}`);
      console.log(`   ⏰ Expira em: ${status.expiresAt.toLocaleString()}\n`);
    } else {
      console.log('   ⚠️ Não foi possível verificar o status\n');
    }

    // 4. Testar estatísticas
    console.log('4️⃣ Testando obtenção de estatísticas...');
    const stats = await PixAPI.getPixStatistics('month');
    
    console.log(`   📊 Estatísticas do mês:`);
    console.log(`      💰 Valor total: ${PixAPI.formatAmount(stats.totalAmount)}`);
    console.log(`      📈 Total de transações: ${stats.totalTransactions}`);
    console.log(`      ✅ Transações pagas: ${stats.paidTransactions}`);
    console.log(`      ⏳ Transações pendentes: ${stats.pendingTransactions}`);
    console.log(`      📊 Valor médio: ${PixAPI.formatAmount(stats.averageAmount)}\n`);

    // 5. Testar validação de código PIX
    console.log('5️⃣ Testando validação de código PIX...');
    const isValidCode = PixAPI.validatePixCode(testPix.copyPasteCode);
    console.log(`   ✅ Código PIX válido: ${isValidCode}\n`);

    // 6. Testar formatação
    console.log('6️⃣ Testando formatação de valores...');
    const testAmounts = [10.50, 100.00, 1000.99, 0.01];
    testAmounts.forEach(amount => {
      console.log(`   💰 ${amount} → ${PixAPI.formatAmount(amount)}`);
    });
    console.log('');

    // 7. Testar instruções
    console.log('7️⃣ Testando instruções de pagamento...');
    const instructions = PixAPI.getPaymentInstructions();
    instructions.forEach((instruction, index) => {
      console.log(`   ${index + 1}. ${instruction}`);
    });
    console.log('');

    console.log('🎉 Todos os testes foram executados com sucesso!');
    console.log('✅ A integração PushinPay está funcionando corretamente.\n');

    return true;

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    console.log('\n🔧 Possíveis soluções:');
    console.log('   1. Verifique se a API key está correta');
    console.log('   2. Verifique a conexão com a internet');
    console.log('   3. Verifique se a API PushinPay está online');
    console.log('   4. Consulte os logs para mais detalhes\n');
    
    return false;
  }
}

// Função para testar apenas a validação da API key
export async function testApiKey() {
  try {
    const isValid = await PixAPI.validateApiKey();
    console.log(`🔑 API Key válida: ${isValid}`);
    return isValid;
  } catch (error) {
    console.error('❌ Erro ao validar API key:', error);
    return false;
  }
}

// Função para testar geração de PIX simples
export async function testPixGeneration(amount: number = 5.00) {
  try {
    const pix = await PixAPI.generatePix({
      amount,
      description: 'Teste de geração PIX',
      customerName: 'Teste',
      customerEmail: 'teste@teste.com'
    });
    
    console.log(`✅ PIX gerado: ${pix.transactionId}`);
    console.log(`💰 Valor: ${PixAPI.formatAmount(pix.amount)}`);
    console.log(`📱 Status: ${pix.status}`);
    
    return pix;
  } catch (error) {
    console.error('❌ Erro ao gerar PIX:', error);
    return null;
  }
}

// Executar testes se este arquivo for executado diretamente
if (typeof window !== 'undefined') {
  // No navegador, adicionar ao objeto window para acesso via console
  (window as any).testPushinPay = {
    runAllTests: testPushinPayIntegration,
    testApiKey,
    testPixGeneration
  };
  
  console.log('🧪 Testes PushinPay disponíveis no console:');
  console.log('   window.testPushinPay.runAllTests() - Executar todos os testes');
  console.log('   window.testPushinPay.testApiKey() - Testar apenas API key');
  console.log('   window.testPushinPay.testPixGeneration(10) - Testar geração de PIX');
  console.log('');
  console.log('📋 Documentação PushinPay: https://app.theneo.io/pushinpay/pix/criar-pix');
}
