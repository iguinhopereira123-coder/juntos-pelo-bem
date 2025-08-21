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

      const response = await fetch(`${this.BASE_URL}/v1/pix/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'X-API-Version': '2024-01-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log(`📡 Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData: PushinPayError = await response.json().catch(() => ({
          error: 'unknown',
          message: `Erro HTTP: ${response.status}`
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
        }
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
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao validar API key:', error);
      return false;
    }
  }
}

// Instância global
export const pushinPay = new PushinPayIntegration();
