// Proxy local para contornar problemas de CORS com PushinPay
// Usar apenas em desenvolvimento

export class PushinPayProxy {
  private static readonly PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
  private static readonly API_BASE = 'https://api.pushinpay.com';
  private static readonly API_KEY = "43550|QC51bcICP2BG9ZGBEDWF6cF1IcUnDfN0tMdhFeq82618ef54";

  /**
   * Testa se o proxy está disponível
   */
  static async testProxy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.PROXY_URL}${this.API_BASE}/v1/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        }
      });
      
      return response.ok;
    } catch (error) {
      console.warn('Proxy não disponível:', error);
      return false;
    }
  }

  /**
   * Cria PIX usando proxy
   */
  static async createPix(payload: any): Promise<any> {
    try {
      const response = await fetch(`${this.PROXY_URL}${this.API_BASE}/v1/pix/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no proxy:', error);
      throw error;
    }
  }

  /**
   * Verifica status usando proxy
   */
  static async checkStatus(transactionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.PROXY_URL}${this.API_BASE}/v1/pix/${transactionId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no proxy:', error);
      throw error;
    }
  }
}

// Função para testar o proxy
export async function testPushinPayProxy() {
  console.log('🔧 Testando proxy PushinPay...');
  
  try {
    const isProxyAvailable = await PushinPayProxy.testProxy();
    
    if (isProxyAvailable) {
      console.log('✅ Proxy disponível!');
      
      // Testar criação de PIX
      const payload = {
        amount: 5.00,
        description: 'Teste via proxy',
        customer: {
          name: 'Teste Proxy',
          email: 'proxy@teste.com'
        },
        expires_in: 1800,
        payment_method: 'pix',
        currency: 'BRL'
      };

      const result = await PushinPayProxy.createPix(payload);
      console.log('✅ PIX criado via proxy:', result);
      
      return result;
    } else {
      console.log('❌ Proxy não disponível');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao testar proxy:', error);
    return null;
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  (window as any).pushinPayProxy = {
    test: testPushinPayProxy,
    createPix: PushinPayProxy.createPix,
    checkStatus: PushinPayProxy.checkStatus
  };
  
  console.log('🔧 Proxy PushinPay disponível no console:');
  console.log('   window.pushinPayProxy.test() - Testar proxy');
  console.log('   window.pushinPayProxy.createPix(payload) - Criar PIX via proxy');
}
