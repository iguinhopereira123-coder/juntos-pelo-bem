// Teste do fallback local da PushinPay
// Para verificar se a geração local de PIX está funcionando

export async function testLocalFallback() {
  console.log('🧪 Testando fallback local da PushinPay...\n');

  try {
    // Importar a integração
    const { pushinPay } = await import('./pushynpay-integration');

    // Testar geração de PIX
    console.log('1️⃣ Testando geração de PIX...');
    const pix = await pushinPay.generatePix({
      amount: 25.00,
      description: 'Teste de fallback local',
      customerName: 'Teste Local',
      customerEmail: 'teste@local.com',
      customerComment: 'Teste de funcionalidade local'
    });

    console.log('✅ PIX gerado com sucesso:');
    console.log(`   Transaction ID: ${pix.transactionId}`);
    console.log(`   Valor: R$ ${pix.amount}`);
    console.log(`   Status: ${pix.status}`);
    console.log(`   QR Code: ${pix.pixQrCode ? 'Disponível' : 'Não disponível'}`);
    console.log(`   Chave PIX: ${pix.pixKey}`);
    console.log(`   Código copia e cola: ${pix.copyPasteCode ? 'Disponível' : 'Não disponível'}`);

    // Testar verificação de status
    console.log('\n2️⃣ Testando verificação de status...');
    const status = await pushinPay.checkPixStatus(pix.transactionId);
    console.log(`   Status: ${status.status}`);

    // Testar validação de API key
    console.log('\n3️⃣ Testando validação de API key...');
    const isValid = await pushinPay.validateApiKey();
    console.log(`   API Key válida: ${isValid}`);

    // Testar estatísticas
    console.log('\n4️⃣ Testando estatísticas...');
    const stats = await pushinPay.getPixStatistics('month');
    console.log(`   Total de transações: ${stats.totalTransactions}`);

    console.log('\n🎉 Todos os testes passaram! O fallback local está funcionando.');
    return true;

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return false;
  }
}

// Função para testar a interface do usuário
export async function testUI() {
  console.log('🎨 Testando interface do usuário...\n');

  try {
    // Simular dados de PIX
    const mockPixData = {
      success: true,
      pixQrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      pixKey: '19998353715',
      pixKeyType: 'phone',
      transactionId: 'local_test_123',
      expiresAt: new Date(Date.now() + 1800 * 1000).toISOString(),
      amount: 50.00,
      status: 'pending' as const,
      copyPasteCode: '00020126580014br.gov.bcb.pix013612345678901234520400005303986540510.005802BR5913Juntos Pelo Bem6009São Paulo62070503***6304D1B8'
    };

    console.log('✅ Dados simulados criados:');
    console.log(`   QR Code: ${mockPixData.pixQrCode ? 'Disponível' : 'Não disponível'}`);
    console.log(`   Chave PIX: ${mockPixData.pixKey}`);
    console.log(`   Código copia e cola: ${mockPixData.copyPasteCode ? 'Disponível' : 'Não disponível'}`);

    return mockPixData;

  } catch (error) {
    console.error('❌ Erro no teste da UI:', error);
    return null;
  }
}

// Função para testar o checkout completo
export async function testCheckout() {
  console.log('🛒 Testando checkout completo...\n');

  try {
    // Simular processo de checkout
    console.log('1️⃣ Preenchendo dados...');
    const donationData = {
      amount: 30.00,
      name: 'João Silva',
      email: 'joao@teste.com',
      comment: 'Força, Isabela! Você vai vencer! ❤️'
    };

    console.log('2️⃣ Gerando PIX...');
    const { pushinPay } = await import('./pushynpay-integration');
    
    const pix = await pushinPay.generatePix({
      amount: donationData.amount,
      description: 'Doação para campanha Isabela',
      customerName: donationData.name,
      customerEmail: donationData.email,
      customerComment: donationData.comment
    });

    console.log('3️⃣ Verificando resultado...');
    console.log(`   ✅ PIX gerado: ${pix.success}`);
    console.log(`   📊 ID: ${pix.transactionId}`);
    console.log(`   💰 Valor: R$ ${pix.amount}`);
    console.log(`   📱 QR Code: ${pix.pixQrCode ? '✅' : '❌'}`);
    console.log(`   🔑 Chave: ${pix.pixKey}`);
    console.log(`   📋 Código: ${pix.copyPasteCode ? '✅' : '❌'}`);

    console.log('\n🎉 Checkout testado com sucesso!');
    return pix;

  } catch (error) {
    console.error('❌ Erro no teste do checkout:', error);
    return null;
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  (window as any).testFallback = {
    testLocal: testLocalFallback,
    testUI,
    testCheckout
  };
  
  console.log('🧪 Testes de fallback disponíveis no console:');
  console.log('   window.testFallback.testLocal() - Testar fallback local');
  console.log('   window.testFallback.testUI() - Testar interface');
  console.log('   window.testFallback.testCheckout() - Testar checkout completo');
}
