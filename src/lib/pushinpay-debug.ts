// Debug da integração PushinPay
// Para identificar problemas com a API

export async function debugPushinPayAPI() {
  console.log('🔍 Iniciando debug da API PushinPay...\n');

  const API_KEY = "43537|cPkJOU9EoOPzY5WeNp4ZkWzunlAjcLmDBHTIniEO5901f62f";
  const BASE_URL = "https://api.pushinpay.com";

  // 1. Testar conectividade básica
  console.log('1️⃣ Testando conectividade básica...');
  try {
    const response = await fetch(`${BASE_URL}/v1/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Version': '2024-01-01',
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${response.status}`);
    console.log(`   OK: ${response.ok}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Conectividade OK:`, data);
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.log(`   ❌ Erro de conectividade:`, errorData);
    }
  } catch (error) {
    console.log(`   ❌ Erro de rede:`, error);
  }

  console.log('');

  // 2. Testar criação de PIX
  console.log('2️⃣ Testando criação de PIX...');
  try {
    const payload = {
      amount: 5.00,
      description: 'Teste de debug PushinPay',
      customer: {
        name: 'Debug Teste',
        email: 'debug@teste.com',
        comment: 'Teste de debug'
      },
      expires_in: 1800,
      payment_method: 'pix',
      currency: 'BRL'
    };

    console.log('   Payload enviado:', JSON.stringify(payload, null, 2));

    const response = await fetch(`${BASE_URL}/v1/pix/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Version': '2024-01-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(`   Status: ${response.status}`);
    console.log(`   OK: ${response.ok}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ PIX criado com sucesso:`, data);
      
      // Verificar campos importantes
      console.log(`   📊 Transaction ID: ${data.transaction_id || data.id || 'N/A'}`);
      console.log(`   💰 Valor: ${data.amount || 'N/A'}`);
      console.log(`   📱 QR Code: ${data.qr_code_url || data.qr_code ? 'Disponível' : 'Não disponível'}`);
      console.log(`   🔑 Chave PIX: ${data.pix_key || 'N/A'}`);
      console.log(`   📋 Código copia e cola: ${data.copy_paste_code || 'N/A'}`);
      
      return data;
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.log(`   ❌ Erro ao criar PIX:`, errorData);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Erro de rede ao criar PIX:`, error);
    return null;
  }
}

// Função para testar diferentes formatos de payload
export async function testPayloadFormats() {
  console.log('🧪 Testando diferentes formatos de payload...\n');

  const API_KEY = "43537|cPkJOU9EoOPzY5WeNp4ZkWzunlAjcLmDBHTIniEO5901f62f";
  const BASE_URL = "https://api.pushinpay.com";

  const payloads = [
    {
      name: 'Formato 1 - Padrão',
      payload: {
        amount: 5.00,
        description: 'Teste formato 1',
        customer: {
          name: 'Teste 1',
          email: 'teste1@teste.com'
        },
        expires_in: 1800,
        payment_method: 'pix',
        currency: 'BRL'
      }
    },
    {
      name: 'Formato 2 - Sem customer',
      payload: {
        amount: 5.00,
        description: 'Teste formato 2',
        expires_in: 1800,
        payment_method: 'pix',
        currency: 'BRL'
      }
    },
    {
      name: 'Formato 3 - Mínimo',
      payload: {
        amount: 5.00,
        description: 'Teste formato 3'
      }
    }
  ];

  for (const test of payloads) {
    console.log(`📝 Testando: ${test.name}`);
    try {
      const response = await fetch(`${BASE_URL}/v1/pix/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(test.payload)
      });

      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Sucesso: ${data.transaction_id || data.id || 'N/A'}`);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        console.log(`   ❌ Erro: ${errorData.message}`);
      }
    } catch (error) {
      console.log(`   ❌ Erro de rede: ${error}`);
    }
    console.log('');
  }
}

// Função para verificar headers
export async function testHeaders() {
  console.log('🔧 Testando diferentes headers...\n');

  const API_KEY = "43537|cPkJOU9EoOPzY5WeNp4ZkWzunlAjcLmDBHTIniEO5901f62f";
  const BASE_URL = "https://api.pushinpay.com";

  const headersTests = [
    {
      name: 'Headers padrão',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Version': '2024-01-01',
        'Content-Type': 'application/json'
      }
    },
    {
      name: 'Sem X-API-Version',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    },
    {
      name: 'Com Accept',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Version': '2024-01-01',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  ];

  const payload = {
    amount: 5.00,
    description: 'Teste headers',
    customer: {
      name: 'Teste Headers',
      email: 'headers@teste.com'
    }
  };

  for (const test of headersTests) {
    console.log(`📝 Testando: ${test.name}`);
    try {
      const response = await fetch(`${BASE_URL}/v1/pix/create`, {
        method: 'POST',
        headers: test.headers,
        body: JSON.stringify(payload)
      });

      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Sucesso: ${data.transaction_id || data.id || 'N/A'}`);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        console.log(`   ❌ Erro: ${errorData.message}`);
      }
    } catch (error) {
      console.log(`   ❌ Erro de rede: ${error}`);
    }
    console.log('');
  }
}

// Função para testar CORS
export async function testCORS() {
  console.log('🌐 Testando problemas de CORS...\n');

  const API_KEY = "43537|cPkJOU9EoOPzY5WeNp4ZkWzunlAjcLmDBHTIniEO5901f62f";
  const BASE_URL = "https://api.pushinpay.com";

  const tests = [
    {
      name: 'CORS padrão',
      options: {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json'
        },
        mode: 'cors' as RequestMode
      }
    },
    {
      name: 'Sem CORS',
      options: {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json'
        },
        mode: 'no-cors' as RequestMode
      }
    },
    {
      name: 'Com credentials',
      options: {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json'
        },
        mode: 'cors' as RequestMode,
        credentials: 'include' as RequestCredentials
      }
    }
  ];

  for (const test of tests) {
    console.log(`📝 Testando: ${test.name}`);
    try {
      const response = await fetch(`${BASE_URL}/v1/auth/validate`, test.options);
      console.log(`   Status: ${response.status}`);
      console.log(`   Type: ${response.type}`);
      console.log(`   OK: ${response.ok}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Sucesso:`, data);
      } else {
        console.log(`   ❌ Erro: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error}`);
    }
    console.log('');
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  (window as any).pushinPayDebug = {
    debugAPI: debugPushinPayAPI,
    testPayloads: testPayloadFormats,
    testHeaders,
    testCORS
  };
  
  console.log('🔍 Debug PushinPay disponível no console:');
  console.log('   window.pushinPayDebug.debugAPI() - Debug completo');
  console.log('   window.pushinPayDebug.testPayloads() - Testar formatos');
  console.log('   window.pushinPayDebug.testHeaders() - Testar headers');
  console.log('   window.pushinPayDebug.testCORS() - Testar CORS');
}
