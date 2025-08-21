// Integração PushinPay para PIX - Foco 100% na API
// Configuração otimizada para produção com proxy CORS

interface PixRequest {
  amount: number;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerComment?: string;
  expiresIn?: number;
}

interface PixResponse {
  success: boolean;
  pixQrCode: string;
  pixKey: string;
  pixKeyType: string;
  transactionId: string;
  expiresAt: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  copyPasteCode?: string;
  error?: string;
}

interface PushinPayError {
  error: string;
  message: string;
  code?: string;
}

export class PushinPayIntegration {
  private readonly API_KEY = "43550|QC51bcICP2BG9ZGBEDWF6cF1IcUnDfN0tMdhFeq82618ef54";
  private readonly BASE_URL = "https://api.pushinpay.com";
  
  // Proxy CORS para contornar bloqueios
  private readonly CORS_PROXIES = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://thingproxy.freeboard.io/fetch/'
  ];

  /**
   * Gera PIX via API PushinPay com fallback de proxy CORS
   */
  async generatePix(request: PixRequest): Promise<PixResponse> {
    try {
      console.log('🚀 Gerando PIX via API PushinPay...');
      
      const payload = {
        amount: request.amount,
        description: request.description,
        customer: {
          name: request.customerName || 'Anônimo',
          email: request.customerEmail || 'anonimo@juntos-pelo-bem.com',
          comment: request.customerComment || '',
        },
        expires_in: request.expiresIn || 1800,
        payment_method: 'pix',
        currency: 'BRL'
      };

      console.log('📤 Payload enviado:', JSON.stringify(payload, null, 2));

      // Primeiro, tentar requisição direta
      try {
        const result = await this.tryDirectRequest(payload);
        if (result.success) {
          console.log('✅ Requisição direta funcionou!');
          return result;
        }
      } catch (error) {
        console.log('⚠️ Requisição direta falhou, tentando proxy CORS...');
      }

      // Se falhar, tentar com proxy CORS
      for (let i = 0; i < this.CORS_PROXIES.length; i++) {
        try {
          console.log(`🔄 Tentando proxy ${i + 1}/${this.CORS_PROXIES.length}: ${this.CORS_PROXIES[i]}`);
          const result = await this.tryProxyRequest(payload, this.CORS_PROXIES[i]);
          if (result.success) {
            console.log(`✅ Proxy ${i + 1} funcionou!`);
            return result;
          }
        } catch (error) {
          console.log(`❌ Proxy ${i + 1} falhou:`, error);
        }
      }

      // Se todos falharem, retornar erro
      throw new Error('Todas as tentativas de conexão falharam');

    } catch (error) {
      console.error('❌ Erro ao gerar PIX:', error);
      
      return {
        success: false,
        pixQrCode: '',
        pixKey: '',
        pixKeyType: 'email',
        transactionId: '',
        expiresAt: '',
        amount: request.amount,
        status: 'pending',
        copyPasteCode: '',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Tenta requisição direta
   */
  private async tryDirectRequest(payload: any): Promise<PixResponse> {
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'X-API-Version': '2024-01-01',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      mode: 'cors' as RequestMode,
      credentials: 'omit' as RequestCredentials,
      cache: 'no-cache' as RequestCache
    };

    const response = await fetch(`${this.BASE_URL}/v1/pix/create`, fetchOptions);

    if (!response.ok) {
      const errorData: PushinPayError = await response.json().catch(() => ({
        error: 'unknown',
        message: `Erro HTTP: ${response.status} - ${response.statusText}`
      }));
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return this.parsePixResponse(data, payload.amount);
  }

  /**
   * Tenta requisição com proxy CORS
   */
  private async tryProxyRequest(payload: any, proxyUrl: string): Promise<PixResponse> {
    const targetUrl = `${this.BASE_URL}/v1/pix/create`;
    const fullUrl = proxyUrl + encodeURIComponent(targetUrl);

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'X-API-Version': '2024-01-01',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(payload),
      mode: 'cors' as RequestMode,
      credentials: 'omit' as RequestCredentials
    };

    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`Proxy falhou: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return this.parsePixResponse(data, payload.amount);
  }

  /**
   * Parse da resposta da API
   */
  private parsePixResponse(data: any, originalAmount: number): PixResponse {
    return {
      success: true,
      pixQrCode: data.qr_code_url || data.qr_code || '',
      pixKey: data.pix_key || '',
      pixKeyType: data.pix_key_type || 'email',
      transactionId: data.transaction_id || data.id || '',
      expiresAt: data.expires_at || new Date(Date.now() + 1800 * 1000).toISOString(),
      amount: data.amount || originalAmount,
      status: data.status || 'pending',
      copyPasteCode: data.copy_paste_code || data.pix_copy_paste || ''
    };
  }

  /**
   * Verifica status do PIX
   */
  async checkPixStatus(transactionId: string): Promise<PixResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/v1/pix/${transactionId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        pixQrCode: data.qr_code_url || data.qr_code || '',
        pixKey: data.pix_key || '',
        pixKeyType: data.pix_key_type || 'email',
        transactionId: data.transaction_id || data.id || transactionId,
        expiresAt: data.expires_at || '',
        amount: data.amount || 0,
        status: data.status || 'pending',
        copyPasteCode: data.copy_paste_code || data.pix_copy_paste || ''
      };

    } catch (error) {
      console.error('Erro ao verificar status:', error);
      throw error;
    }
  }

  /**
   * Valida API key
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/v1/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao validar API key:', error);
      return false;
    }
  }

  /**
   * Testa conectividade básica
   */
  async testConnectivity(): Promise<boolean> {
    try {
      console.log('🔗 Testando conectividade com PushinPay...');
      
      const response = await fetch(`${this.BASE_URL}/v1/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      console.log(`📡 Status: ${response.status} ${response.statusText}`);
      console.log(`📡 OK: ${response.ok}`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conectividade OK:', data);
        return true;
      } else {
        console.log('❌ Erro de conectividade:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro de rede:', error);
      return false;
    }
  }

  /**
   * Testa todos os proxies disponíveis
   */
  async testAllProxies(): Promise<{ proxy: string; working: boolean }[]> {
    const results = [];
    
    for (const proxy of this.CORS_PROXIES) {
      try {
        console.log(`🧪 Testando proxy: ${proxy}`);
        const testUrl = proxy + encodeURIComponent('https://httpbin.org/get');
        const response = await fetch(testUrl, { mode: 'cors' });
        const working = response.ok;
        results.push({ proxy, working });
        console.log(`   ${working ? '✅' : '❌'} ${proxy}`);
      } catch (error) {
        results.push({ proxy, working: false });
        console.log(`   ❌ ${proxy}`);
      }
    }
    
    return results;
  }
}

// Instância global
export const pushinPay = new PushinPayIntegration();

// Funções de teste globais
if (typeof window !== 'undefined') {
  (window as any).pushinPayTest = {
    testConnectivity: () => pushinPay.testConnectivity(),
    validateApiKey: () => pushinPay.validateApiKey(),
    generateTestPix: () => pushinPay.generatePix({
      amount: 5.00,
      description: 'Teste de conectividade',
      customerName: 'Teste',
      customerEmail: 'teste@teste.com'
    }),
    testAllProxies: () => pushinPay.testAllProxies()
  };
  
  console.log('🧪 Testes PushinPay disponíveis no console:');
  console.log('   window.pushinPayTest.testConnectivity() - Testar conectividade');
  console.log('   window.pushinPayTest.validateApiKey() - Validar API key');
  console.log('   window.pushinPayTest.generateTestPix() - Gerar PIX de teste');
  console.log('   window.pushinPayTest.testAllProxies() - Testar todos os proxies');
}
