// API de PIX integrada com PushinPay
// Implementa integração real com a API da PushinPay

import QRCode from 'qrcode';
import { pushinPay, PushinPayIntegration } from './pushynpay-integration';

export interface PixData {
  qrCode: string;
  pixKey: string;
  pixKeyType: string;
  transactionId: string;
  expiresAt: Date;
  amount: number;
  copyPasteCode: string; // Código copia e cola
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
}

export interface PixRequest {
  amount: number;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerComment?: string;
}

export class PixAPI {
  private static pushinPayInstance: PushinPayIntegration = pushinPay;

  /**
   * Gera dados do PIX para um valor específico usando PushinPay
   */
  static async generatePix(data: PixRequest): Promise<PixData> {
    const { amount, description, customerName, customerEmail, customerComment } = data;
    
    // Validar valor mínimo
    if (amount < 0.01) {
      throw new Error("Valor mínimo para PIX é R$ 0,01");
    }

    try {
      // Gerar PIX usando PushinPay
      const pixResponse = await this.pushinPayInstance.generatePix({
        amount,
        description: description || `Doação - Juntos Pelo Bem`,
        customerName,
        customerEmail,
        customerComment,
        expiresIn: 1800 // 30 minutos
      });

      // Se a API retornou um QR Code URL, usamos ele
      // Caso contrário, geramos um QR Code localmente
      let qrCodeDataURL = pixResponse.pixQrCode;
      
      if (!qrCodeDataURL && pixResponse.copyPasteCode) {
        // Gerar QR Code localmente a partir do código copia e cola
        qrCodeDataURL = await this.generateQRCodeFromPayload(pixResponse.copyPasteCode);
      } else if (!qrCodeDataURL) {
        // Fallback: gerar QR Code simulado
        qrCodeDataURL = this.generateFallbackQRCode(pixResponse.copyPasteCode || '');
      }

      return {
        qrCode: qrCodeDataURL,
        pixKey: pixResponse.pixKey,
        pixKeyType: pixResponse.pixKeyType,
        transactionId: pixResponse.transactionId,
        expiresAt: new Date(pixResponse.expiresAt),
        amount: pixResponse.amount,
        copyPasteCode: pixResponse.copyPasteCode || '',
        status: pixResponse.status
      };
    } catch (error) {
      console.error('Erro ao gerar PIX com PushinPay:', error);
      
      // Fallback para implementação local em caso de erro
      return this.generateLocalPix(data);
    }
  }

  /**
   * Verifica o status de um PIX
   */
  static async checkPixStatus(transactionId: string): Promise<PixData | null> {
    try {
      const status = await this.pushinPayInstance.checkPixStatus(transactionId);
      
      return {
        qrCode: status.pixQrCode || '',
        pixKey: status.pixKey,
        pixKeyType: status.pixKeyType,
        transactionId: status.transactionId,
        expiresAt: new Date(status.expiresAt),
        amount: status.amount,
        copyPasteCode: status.copyPasteCode || '',
        status: status.status
      };
    } catch (error) {
      console.error('Erro ao verificar status do PIX:', error);
      return null;
    }
  }

  /**
   * Cancela um PIX
   */
  static async cancelPix(transactionId: string): Promise<boolean> {
    try {
      const result = await this.pushinPayInstance.cancelPix(transactionId);
      return result.success;
    } catch (error) {
      console.error('Erro ao cancelar PIX:', error);
      return false;
    }
  }

  /**
   * Obtém estatísticas das transações PIX
   */
  static async getPixStatistics(period?: 'today' | 'week' | 'month' | 'year') {
    try {
      return await this.pushinPayInstance.getPixStatistics(period);
    } catch (error) {
      console.error('Erro ao obter estatísticas PIX:', error);
      return {
        totalAmount: 0,
        totalTransactions: 0,
        paidTransactions: 0,
        pendingTransactions: 0,
        averageAmount: 0
      };
    }
  }

  /**
   * Valida se a API key está funcionando
   */
  static async validateApiKey(): Promise<boolean> {
    try {
      return await this.pushinPayInstance.validateApiKey();
    } catch (error) {
      console.error('Erro ao validar API key:', error);
      return false;
    }
  }

  /**
   * Gera QR Code a partir de um payload PIX
   */
  private static async generateQRCodeFromPayload(payload: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        width: 256,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      return this.generateFallbackQRCode(payload);
    }
  }

  /**
   * Implementação local de PIX (fallback)
   */
  private static async generateLocalPix(data: PixRequest): Promise<PixData> {
    const { amount, description } = data;
    
    // Gerar ID único da transação
    const transactionId = `PIX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Data de expiração (30 minutos)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    
    // Gerar payload do PIX seguindo padrão EMV
    const pixPayload = this.generatePixPayload(amount, description);
    
    // Gerar QR Code real
    const qrCode = await this.generateQRCodeFromPayload(pixPayload);
    
    // Gerar código copia e cola
    const copyPasteCode = this.generateCopyPasteCode(amount, description);
    
    return {
      qrCode,
      pixKey: "19998353715", // Chave PIX local
      pixKeyType: "phone",
      transactionId,
      expiresAt,
      amount,
      copyPasteCode,
      status: 'pending'
    };
  }

  /**
   * Gera o payload do PIX seguindo o padrão EMV QR Code (fallback)
   */
  private static generatePixPayload(amount: number, description?: string): string {
    const PIX_KEY = "19998353715";
    const PIX_KEY_TYPE = "phone";
    const MERCHANT_NAME = "Juntos Pelo Bem";
    const MERCHANT_CITY = "SAO PAULO";
    
    const amountStr = amount.toFixed(2);
    const descriptionText = description || `Doação - Juntos Pelo Bem`;
    
    // Estrutura EMV QR Code para PIX (padrão brasileiro)
    const payload = [
      "000201", // Payload Format Indicator
      "010212", // Point of Initiation Method (12 = static)
      "2662", // Merchant Account Information
      "0014br.gov.bcb.pix", // Global Unique Identifier
      "01" + PIX_KEY.length.toString().padStart(2, '0') + PIX_KEY, // PIX Key
      "52040000", // Merchant Category Code
      "5303986", // Transaction Currency (BRL)
      "54" + amountStr.length.toString().padStart(2, '0') + amountStr, // Transaction Amount
      "5802BR", // Country Code
      "59" + MERCHANT_NAME.length.toString().padStart(2, '0') + MERCHANT_NAME, // Merchant Name
      "60" + MERCHANT_CITY.length.toString().padStart(2, '0') + MERCHANT_CITY, // Merchant City
      "62" + (descriptionText.length + 5).toString().padStart(2, '0') + "05" + descriptionText.length.toString().padStart(2, '0') + descriptionText, // Additional Data Field
      "6304" // CRC16
    ].join('');
    
    // Calcular CRC16 real
    const crc = this.calculateCRC16(payload);
    
    return payload + crc;
  }

  /**
   * Calcula CRC16 para validação do payload
   */
  private static calculateCRC16(payload: string): string {
    let crc = 0xFFFF;
    const polynomial = 0x1021;
    
    for (let i = 0; i < payload.length; i++) {
      crc ^= (payload.charCodeAt(i) << 8);
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc <<= 1;
        }
      }
    }
    
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }

  /**
   * QR Code de fallback caso a biblioteca falhe
   */
  private static generateFallbackQRCode(payload: string): string {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fundo branco
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 256, 256);
      
      // Borda preta
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 236, 236);
      
      // Texto "PIX" no centro
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PIX', 128, 128);
      
      // Valor
      ctx.font = '20px Arial';
      ctx.fillText('QR Code', 128, 160);
      ctx.fillText('Gerado', 128, 185);
      
      // Informação adicional
      ctx.font = '14px Arial';
      ctx.fillText('PushinPay', 128, 210);
    }
    
    return canvas.toDataURL('image/png');
  }

  /**
   * Gera código copia e cola para PIX (fallback)
   */
  private static generateCopyPasteCode(amount: number, description?: string): string {
    const PIX_KEY = "19998353715";
    const MERCHANT_NAME = "Juntos Pelo Bem";
    const MERCHANT_CITY = "SAO PAULO";
    
    const amountStr = amount.toFixed(2);
    const descriptionText = description || `Doação - Juntos Pelo Bem`;
    
    // Formato: PIX copia e cola com valor fixo
    const copyPasteCode = [
      "000201", // Payload Format Indicator
      "010212", // Point of Initiation Method
      "2662", // Merchant Account Information
      "0014br.gov.bcb.pix", // Global Unique Identifier
      "01" + PIX_KEY.length.toString().padStart(2, '0') + PIX_KEY, // PIX Key
      "52040000", // Merchant Category Code
      "5303986", // Transaction Currency (BRL)
      "54" + amountStr.length.toString().padStart(2, '0') + amountStr, // Transaction Amount
      "5802BR", // Country Code
      "59" + MERCHANT_NAME.length.toString().padStart(2, '0') + MERCHANT_NAME, // Merchant Name
      "60" + MERCHANT_CITY.length.toString().padStart(2, '0') + MERCHANT_CITY, // Merchant City
      "62" + (descriptionText.length + 5).toString().padStart(2, '0') + "05" + descriptionText.length.toString().padStart(2, '0') + descriptionText, // Additional Data Field
      "6304" // CRC16
    ].join('');
    
    // Calcular CRC16 para o código copia e cola
    const crc = this.calculateCRC16(copyPasteCode);
    
    return copyPasteCode + crc;
  }

  /**
   * Valida se um PIX ainda é válido
   */
  static isPixValid(expiresAt: Date): boolean {
    return new Date() < expiresAt;
  }

  /**
   * Formata o valor para exibição
   */
  static formatAmount(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  /**
   * Gera instruções de pagamento
   */
  static getPaymentInstructions(): string[] {
    return [
      "1. Abra o app do seu banco",
      "2. Escolha 'Pagar via PIX'",
      "3. Escaneie o QR Code ou cole o código copia e cola",
      "4. Confirme os dados e finalize o pagamento"
    ];
  }

  /**
   * Valida se um código PIX é válido
   */
  static validatePixCode(code: string): boolean {
    if (!code || code.length < 20) return false;
    
    try {
      // Verificar se começa com o padrão correto
      if (!code.startsWith('000201')) return false;
      
      // Verificar se contém os campos obrigatórios
      if (!code.includes('br.gov.bcb.pix')) return false;
      if (!code.includes('5303986')) return false; // BRL
      if (!code.includes('5802BR')) return false; // Brasil
      
      return true;
    } catch {
      return false;
    }
  }
}
