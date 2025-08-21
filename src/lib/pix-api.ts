// API PIX simplificada - Foco 100% na PushinPay
import { pushinPay } from './pushynpay-integration';

export interface PixData {
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

export interface PixRequest {
  amount: number;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerComment?: string;
  expiresIn?: number;
}

export class PixAPI {
  /**
   * Gera PIX via PushinPay
   */
  static async generatePix(request: PixRequest): Promise<PixData> {
    console.log('🚀 PixAPI: Gerando PIX via PushinPay...');
    return await pushinPay.generatePix(request);
  }

  /**
   * Verifica status do PIX
   */
  static async checkPixStatus(transactionId: string): Promise<PixData | null> {
    try {
      console.log('🔍 PixAPI: Verificando status do PIX...');
      return await pushinPay.checkPixStatus(transactionId);
    } catch (error) {
      console.error('❌ PixAPI: Erro ao verificar status:', error);
      return null;
    }
  }

  /**
   * Valida API key
   */
  static async validateApiKey(): Promise<boolean> {
    console.log('🔑 PixAPI: Validando API key...');
    return await pushinPay.validateApiKey();
  }

  /**
   * Formata valor monetário
   */
  static formatAmount(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  /**
   * Valida código PIX
   */
  static validatePixCode(code: string): boolean {
    return code && code.length > 0;
  }

  /**
   * Instruções de pagamento
   */
  static getPaymentInstructions(): string[] {
    return [
      'Abra seu app bancário',
      'Escolha "PIX" ou "Pagar PIX"',
      'Escaneie o QR Code ou cole o código',
      'Confirme o valor e dados',
      'Finalize o pagamento'
    ];
  }
}
