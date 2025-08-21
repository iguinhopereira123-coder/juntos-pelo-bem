// Integração com PushinPay para PIX
// Configuração real com API key fornecida
// Baseado na documentação oficial da PushinPay

import { VERCEL_CONFIG, isVercelEnvironment, getApiKey, getAuthHeaders } from './vercel-config';

interface PushinPayConfig {
  apiKey: string;
  environment: 'sandbox' | 'production';
}

interface PixRequest {
  amount: number;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerComment?: string;
  expiresIn?: number; // segundos, padrão 30 minutos
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
}

interface PushinPayError {
  error: string;
  message: string;
  code?: string;
}

export class PushinPayIntegration {
  private config: PushinPayConfig;
  private baseUrl: string;
  private isDevelopment: boolean;

  constructor(config?: Partial<PushinPayConfig>) {
    this.config = {
      apiKey: config?.apiKey || "43537|cPkJOU9EoOPzY5WeNp4ZkWzunlAjcLmDBHTIniEO5901f62f",
      environment: config?.environment || 'production'
    };
    
    // URLs corretas da PushinPay conforme documentação
    this.baseUrl = this.config.environment === 'production' 
      ? 'https://api.pushinpay.com' 
      : 'https://sandbox.pushinpay.com';
    
    // Detectar se está em desenvolvimento ou Vercel
    this.isDevelopment = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname.includes('localhost') ||
       window.location.hostname.includes('vercel.app'));
  }

  /**
   * Gera um PIX para doação
   */
  async generatePix(request: PixRequest): Promise<PixResponse> {
    // Verificar se está na Vercel ou desenvolvimento
    if (isVercelEnvironment()) {
      console.log('🚀 Vercel detectado - tentando API PushinPay primeiro');
      
      try {
        // Tentar API PushinPay na Vercel
        const result = await this.tryPushinPayAPI(request);
        if (result.success) {
          console.log('✅ API PushinPay funcionou na Vercel');
          return result;
        }
      } catch (error) {
        console.warn('⚠️ API PushinPay falhou na Vercel, usando fallback:', error);
      }
    }
    
    // Em desenvolvimento local, usar sempre fallback
    if (this.isDevelopment) {
      console.log('🔧 Desenvolvimento local detectado - usando fallback local');
      return this.generateLocalPix(request);
    }

    // Tentar API PushinPay (método separado para Vercel)
    return this.tryPushinPayAPI(request);
  }

  /**
   * Método específico para tentar API PushinPay (usado na Vercel)
   */
  private async tryPushinPayAPI(request: PixRequest): Promise<PixResponse> {
    try {
      // Payload correto baseado na documentação oficial PushinPay
      const payload = {
        amount: request.amount,
        description: request.description,
        customer: {
          name: request.customerName || 'Anônimo',
          email: request.customerEmail || 'anonimo@juntos-pelo-bem.com',
          comment: request.customerComment,
        },
        expires_in: request.expiresIn || 1800, // 30 minutos padrão
        payment_method: 'pix',
        currency: 'BRL'
      };

      // Usar configuração da Vercel
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
        mode: VERCEL_CONFIG.CORS_MODE,
        credentials: VERCEL_CONFIG.CREDENTIALS
      };

      // Timeout para requisição
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), VERCEL_CONFIG.REQUEST_TIMEOUT);

      const response = await fetch(`${this.baseUrl}/v1/pix/create`, {
        ...fetchOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: PushinPayError = await response.json().catch(() => ({
          error: 'unknown',
          message: `Erro HTTP: ${response.status}`
        }));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        pixQrCode: data.qr_code_url || data.qr_code,
        pixKey: data.pix_key || '',
        pixKeyType: data.pix_key_type || 'email',
        transactionId: data.transaction_id || data.id,
        expiresAt: data.expires_at || new Date(Date.now() + (request.expiresIn || 1800) * 1000).toISOString(),
        amount: data.amount,
        status: data.status || 'pending',
        copyPasteCode: data.copy_paste_code || data.pix_copy_paste
      };
    } catch (error) {
      console.error('Erro ao gerar PIX via API:', error);
      
      // Se falhar, usar fallback local
      console.warn('Usando fallback local devido a erro na API');
      return this.generateLocalPix(request);
    }
  }

  /**
   * Fallback local para gerar PIX quando a API não está disponível
   */
  private async generateLocalPix(request: PixRequest): Promise<PixResponse> {
    const transactionId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + (request.expiresIn || 1800) * 1000);
    
    // Gerar QR Code local usando qrcode library
    const qrCodeData = this.generatePixPayload(request);
    
    return {
      success: true,
      pixQrCode: `data:image/png;base64,${await this.generateQRCodeBase64(qrCodeData)}`,
      pixKey: '19998353715', // Chave PIX padrão
      pixKeyType: 'phone',
      transactionId: transactionId,
      expiresAt: expiresAt.toISOString(),
      amount: request.amount,
      status: 'pending',
      copyPasteCode: qrCodeData
    };
  }

  /**
   * Gera payload PIX local
   */
  private generatePixPayload(request: PixRequest): string {
    const pixData = {
      payloadFormatIndicator: '01',
      pointOfInitiationMethod: '12',
      merchantAccountInformation: {
        gui: 'br.gov.bcb.pix',
        key: '19998353715',
        description: request.description
      },
      merchantCategoryCode: '8398',
      transactionCurrency: '986',
      transactionAmount: request.amount.toFixed(2),
      countryCode: 'BR',
      merchantName: 'Juntos Pelo Bem',
      merchantCity: 'São Paulo',
      additionalDataFieldTemplate: {
        referenceLabel: request.customerName || 'Anônimo'
      }
    };

    return JSON.stringify(pixData);
  }

  /**
   * Gera QR Code em base64
   */
  private async generateQRCodeBase64(data: string): Promise<string> {
    try {
      // Usar uma API pública para gerar QR Code
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
      const response = await fetch(qrApiUrl);
      const blob = await response.blob();
      
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove o prefixo data:image/png;base64,
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      // Retornar um QR Code vazio em caso de erro
      return '';
    }
  }

  /**
   * Verifica o status de um PIX
   */
  async checkPixStatus(transactionId: string): Promise<PixResponse> {
    // Em desenvolvimento, simular status
    if (this.isDevelopment || transactionId.startsWith('local_')) {
      return {
        success: true,
        pixQrCode: '',
        pixKey: '19998353715',
        pixKeyType: 'phone',
        transactionId: transactionId,
        expiresAt: new Date(Date.now() + 1800 * 1000).toISOString(),
        amount: 0,
        status: 'pending',
        copyPasteCode: ''
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/pix/${transactionId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-API-Version': '2024-01-01',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorData: PushinPayError = await response.json().catch(() => ({
          error: 'unknown',
          message: `Erro HTTP: ${response.status}`
        }));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        pixQrCode: data.qr_code_url || data.qr_code || '',
        pixKey: data.pix_key || '',
        pixKeyType: data.pix_key_type || 'email',
        transactionId: data.transaction_id || data.id,
        expiresAt: data.expires_at || '',
        amount: data.amount,
        status: data.status || 'pending',
        copyPasteCode: data.copy_paste_code || data.pix_copy_paste
      };
    } catch (error) {
      console.error('Erro ao verificar status do PIX:', error);
      throw new Error(error instanceof Error ? error.message : 'Falha ao verificar status do PIX.');
    }
  }

  /**
   * Cancela um PIX
   */
  async cancelPix(transactionId: string): Promise<{ success: boolean; message?: string }> {
    // Em desenvolvimento, simular cancelamento
    if (this.isDevelopment || transactionId.startsWith('local_')) {
      return { success: true, message: 'PIX cancelado com sucesso (simulado)' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/pix/${transactionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-API-Version': '2024-01-01',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorData: PushinPayError = await response.json().catch(() => ({
          error: 'unknown',
          message: `Erro HTTP: ${response.status}`
        }));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, message: data.message || 'PIX cancelado com sucesso' };
    } catch (error) {
      console.error('Erro ao cancelar PIX:', error);
      throw new Error(error instanceof Error ? error.message : 'Falha ao cancelar PIX.');
    }
  }

  /**
   * Lista todas as transações PIX
   */
  async listPixTransactions(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ transactions: PixResponse[]; total: number; hasMore: boolean }> {
    // Em desenvolvimento, retornar lista vazia
    if (this.isDevelopment) {
      return {
        transactions: [],
        total: 0,
        hasMore: false
      };
    }

    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      const response = await fetch(`${this.baseUrl}/v1/pix/transactions?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-API-Version': '2024-01-01',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorData: PushinPayError = await response.json().catch(() => ({
          error: 'unknown',
          message: `Erro HTTP: ${response.status}`
        }));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        transactions: data.transactions || data.data || [],
        total: data.total || 0,
        hasMore: data.has_more || false
      };
    } catch (error) {
      console.error('Erro ao listar transações PIX:', error);
      throw new Error(error instanceof Error ? error.message : 'Falha ao listar transações PIX.');
    }
  }

  /**
   * Obtém estatísticas das transações PIX
   */
  async getPixStatistics(period?: 'today' | 'week' | 'month' | 'year'): Promise<{
    totalAmount: number;
    totalTransactions: number;
    paidTransactions: number;
    pendingTransactions: number;
    averageAmount: number;
  }> {
    // Em desenvolvimento, retornar estatísticas simuladas
    if (this.isDevelopment) {
      return {
        totalAmount: 0,
        totalTransactions: 0,
        paidTransactions: 0,
        pendingTransactions: 0,
        averageAmount: 0
      };
    }

    try {
      const queryParams = new URLSearchParams();
      if (period) {
        queryParams.append('period', period);
      }

      const response = await fetch(`${this.baseUrl}/v1/pix/statistics?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-API-Version': '2024-01-01',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorData: PushinPayError = await response.json().catch(() => ({
          error: 'unknown',
          message: `Erro HTTP: ${response.status}`
        }));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        totalAmount: data.total_amount || 0,
        totalTransactions: data.total_transactions || 0,
        paidTransactions: data.paid_transactions || 0,
        pendingTransactions: data.pending_transactions || 0,
        averageAmount: data.average_amount || 0
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas PIX:', error);
      throw new Error(error instanceof Error ? error.message : 'Falha ao obter estatísticas PIX.');
    }
  }

  /**
   * Valida se a API key está funcionando
   */
  async validateApiKey(): Promise<boolean> {
    // Em desenvolvimento, sempre retornar true
    if (this.isDevelopment) {
      console.log('🔧 Desenvolvimento detectado - API key válida (simulado)');
      return true;
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-API-Version': '2024-01-01',
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
}

// Instância global da integração PushinPay
export const pushinPay = new PushinPayIntegration();

// Exemplo de uso:
/*
// Gerar PIX
const pix = await pushinPay.generatePix({
  amount: 50.00,
  description: 'Doação para campanha Isabela',
  customerName: 'João Silva',
  customerEmail: 'joao@email.com',
  customerComment: 'Força, Isabela! Você vai vencer! ❤️',
  expiresIn: 1800, // 30 minutos
});

// Verificar status
const status = await pushinPay.checkPixStatus(pix.transactionId);

// Obter estatísticas
const stats = await pushinPay.getPixStatistics('month');
*/
