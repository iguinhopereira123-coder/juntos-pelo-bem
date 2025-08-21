// Configuração PushinPay para testes
// Baseado na documentação oficial da PushinPay

export const PUSHINPAY_CONFIG = {
  // API Key fornecida
  API_KEY: "43550|QC51bcICP2BG9ZGBEDWF6cF1IcUnDfN0tMdhFeq82618ef54",
  
  // URLs da API
  PRODUCTION_URL: "https://api.pushinpay.com",
  SANDBOX_URL: "https://sandbox.pushinpay.com",
  
  // Endpoints
  ENDPOINTS: {
    CREATE_PIX: "/v1/pix/create",
    CHECK_STATUS: "/v1/pix",
    CANCEL_PIX: "/v1/pix",
    LIST_TRANSACTIONS: "/v1/pix/transactions",
    STATISTICS: "/v1/pix/statistics",
    VALIDATE_AUTH: "/v1/auth/validate"
  },
  
  // Headers padrão
  HEADERS: {
    'Content-Type': 'application/json',
            'Authorization': `Bearer 43550|QC51bcICP2BG9ZGBEDWF6cF1IcUnDfN0tMdhFeq82618ef54`,
    'X-API-Version': '2024-01-01'
  },
  
  // Configurações padrão
  DEFAULTS: {
    EXPIRES_IN: 1800, // 30 minutos
    CURRENCY: 'BRL',
    PAYMENT_METHOD: 'pix',
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 10000.00
  }
};

// Função para testar a conectividade com a API
export async function testPushinPayConnection() {
  try {
    const response = await fetch(`${PUSHINPAY_CONFIG.PRODUCTION_URL}${PUSHINPAY_CONFIG.ENDPOINTS.VALIDATE_AUTH}`, {
      method: 'GET',
      headers: PUSHINPAY_CONFIG.HEADERS
    });
    
    console.log('🔗 Teste de conectividade PushinPay:');
    console.log(`   Status: ${response.status}`);
    console.log(`   OK: ${response.ok}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Resposta:`, data);
      return true;
    } else {
      console.log(`   Erro: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao testar conectividade:', error);
    return false;
  }
}

// Função para testar criação de PIX
export async function testPixCreation(amount: number = 5.00) {
  try {
    const payload = {
      amount: amount,
      description: 'Teste de integração PushinPay',
      customer: {
        name: 'Teste Usuário',
        email: 'teste@juntos-pelo-bem.com',
        comment: 'Teste de funcionalidade'
      },
      expires_in: 1800,
      payment_method: 'pix',
      currency: 'BRL'
    };

    const response = await fetch(`${PUSHINPAY_CONFIG.PRODUCTION_URL}${PUSHINPAY_CONFIG.ENDPOINTS.CREATE_PIX}`, {
      method: 'POST',
      headers: PUSHINPAY_CONFIG.HEADERS,
      body: JSON.stringify(payload)
    });
    
    console.log('🧪 Teste de criação de PIX:');
    console.log(`   Status: ${response.status}`);
    console.log(`   OK: ${response.ok}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Resposta:`, data);
      return data;
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.log(`   Erro: ${errorData.message}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao testar criação de PIX:', error);
    return null;
  }
}

// Função para obter headers com API key dinâmica
export function getHeaders(apiKey?: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey || PUSHINPAY_CONFIG.API_KEY}`,
    'X-API-Version': '2024-01-01'
  };
}

// Função para validar configuração
export function validateConfig() {
  console.log('🔧 Validação da configuração PushinPay:');
  console.log(`   API Key: ${PUSHINPAY_CONFIG.API_KEY ? '✅ Configurada' : '❌ Não configurada'}`);
  console.log(`   Production URL: ${PUSHINPAY_CONFIG.PRODUCTION_URL}`);
  console.log(`   Sandbox URL: ${PUSHINPAY_CONFIG.SANDBOX_URL}`);
  console.log(`   Endpoints: ${Object.keys(PUSHINPAY_CONFIG.ENDPOINTS).length} configurados`);
  
  return {
    apiKeyConfigured: !!PUSHINPAY_CONFIG.API_KEY,
    urlsConfigured: !!PUSHINPAY_CONFIG.PRODUCTION_URL && !!PUSHINPAY_CONFIG.SANDBOX_URL,
    endpointsConfigured: Object.keys(PUSHINPAY_CONFIG.ENDPOINTS).length > 0
  };
}

// Exportar para uso global no console
if (typeof window !== 'undefined') {
  (window as any).pushinPayConfig = {
    config: PUSHINPAY_CONFIG,
    testConnection: testPushinPayConnection,
    testPixCreation,
    getHeaders,
    validateConfig
  };
  
  console.log('🔧 Configuração PushinPay disponível no console:');
  console.log('   window.pushinPayConfig.validateConfig() - Validar configuração');
  console.log('   window.pushinPayConfig.testConnection() - Testar conectividade');
  console.log('   window.pushinPayConfig.testPixCreation(10) - Testar criação de PIX');
}
