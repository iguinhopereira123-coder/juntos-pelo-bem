// Integração PushinPay para PIX - Foco 100% na API
// Configuração otimizada para produção

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

  /**
   * Gera PIX via API PushinPay
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

      // Configurações de fetch com CORS
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

      console.log('🌐 Configurações de fetch:', {
        url: `${this.BASE_URL}/v1/pix/create`,
        method: fetchOptions.method,
        headers: fetchOptions.headers,
        mode: fetchOptions.mode,
        credentials: fetchOptions.credentials
      });

      const response = await fetch(`${this.BASE_URL}/v1/pix/create`, fetchOptions);

      console.log(`📡 Status: ${response.status} ${response.statusText}`);
      console.log(`📡 Headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData: PushinPayError = await response.json().catch(() => ({
          error: 'unknown',
          message: `Erro HTTP: ${response.status} - ${response.statusText}`
        }));
        
        console.error('❌ Erro da API:', errorData);
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Resposta da API:', data);

      return {
        success: true,
        pixQrCode: data.qr_code_url || data.qr_code || '',
        pixKey: data.pix_key || '',
        pixKeyType: data.pix_key_type || 'email',
        transactionId: data.transaction_id || data.id || '',
        expiresAt: data.expires_at || new Date(Date.now() + (request.expiresIn || 1800) * 1000).toISOString(),
        amount: data.amount || request.amount,
        status: data.status || 'pending',
        copyPasteCode: data.copy_paste_code || data.pix_copy_paste || ''
      };

    } catch (error) {
      console.error('❌ Erro ao gerar PIX:', error);
      
      // Log detalhado do erro
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Erro de rede/CORS detectado');
        console.error('💡 Possíveis causas:');
        console.error('   - Bloqueio de CORS pelo navegador');
        console.error('   - API PushinPay não acessível');
        console.error('   - Problema de conectividade');
      }
      
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
    })
  };
  
  console.log('🧪 Testes PushinPay disponíveis no console:');
  console.log('   window.pushinPayTest.testConnectivity() - Testar conectividade');
  console.log('   window.pushinPayTest.validateApiKey() - Validar API key');
  console.log('   window.pushinPayTest.generateTestPix() - Gerar PIX de teste');
}
