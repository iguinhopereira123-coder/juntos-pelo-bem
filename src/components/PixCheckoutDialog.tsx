import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { pushinPay } from '../lib/pushynpay-integration';
import { useToast } from '../hooks/use-toast';

interface PixCheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PixCheckoutDialog({ isOpen, onClose }: PixCheckoutDialogProps) {
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerComment, setCustomerComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleGeneratePix = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Por favor, insira um valor válido');
      return;
    }

    setIsLoading(true);
    setError('');
    setPixData(null);

    try {
      console.log('🔄 Iniciando geração de PIX...');
      
      const result = await pushinPay.generatePix({
        amount: parseFloat(amount),
        description: `Doação para campanha Isabela - ${customerName || 'Anônimo'}`,
        customerName: customerName || 'Anônimo',
        customerEmail: customerEmail || 'anonimo@juntos-pelo-bem.com',
        customerComment: customerComment || '',
        expiresIn: 1800 // 30 minutos
      });

      console.log('📊 Resultado da API:', result);

      if (result.success) {
        setPixData(result);
        toast({
          title: "PIX Gerado com Sucesso!",
          description: "Escaneie o QR Code ou copie o código PIX para pagar.",
        });
      } else {
        setError(result.error || 'Erro ao gerar PIX');
        toast({
          title: "Erro ao Gerar PIX",
          description: result.error || "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('❌ Erro no checkout:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro ao Gerar PIX",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPixCode = () => {
    if (pixData?.copyPasteCode) {
      navigator.clipboard.writeText(pixData.copyPasteCode);
      toast({
        title: "Código PIX Copiado!",
        description: "Cole no seu app bancário para pagar.",
      });
    }
  };

  const handleClose = () => {
    setAmount('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerComment('');
    setPixData(null);
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            💝 Faça sua Doação via PIX
          </DialogTitle>
        </DialogHeader>

        {!pixData ? (
          // Formulário de entrada
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  Valor da Doação (R$)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Seu Nome (opcional)
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Como você gostaria de ser identificado"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Seu Email (opcional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="comment" className="text-sm font-medium">
                  Mensagem para Isabela (opcional)
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Deixe uma mensagem de carinho e força para Isabela..."
                  value={customerComment}
                  onChange={(e) => setCustomerComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGeneratePix}
              disabled={isLoading || !amount}
              className="w-full h-12 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Gerando PIX...
                </>
              ) : (
                'Gerar PIX para Doação'
              )}
            </Button>
          </div>
        ) : (
          // Exibição do PIX gerado
          <div className="space-y-4">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold text-green-800">
                    💰 R$ {pixData.amount.toFixed(2).replace('.', ',')}
                  </div>
                  
                  {pixData.pixQrCode && (
                    <div className="flex justify-center">
                      <img
                        src={pixData.pixQrCode}
                        alt="QR Code PIX"
                        className="w-48 h-48 border-2 border-gray-300 rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>ID da Transação:</strong> {pixData.transactionId}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Expira em:</strong> {new Date(pixData.expiresAt).toLocaleString('pt-BR')}
                    </p>
                  </div>

                  {pixData.copyPasteCode && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Código PIX (Copie e Cole):
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={pixData.copyPasteCode}
                          readOnly
                          className="text-xs font-mono"
                        />
                        <Button
                          onClick={handleCopyPixCode}
                          size="sm"
                          variant="outline"
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📱 <strong>Como pagar:</strong>
                    </p>
                    <ul className="text-xs text-blue-700 mt-1 space-y-1">
                      <li>• Abra seu app bancário</li>
                      <li>• Escolha "PIX" ou "Pagar PIX"</li>
                      <li>• Escaneie o QR Code ou cole o código</li>
                      <li>• Confirme o pagamento</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                onClick={() => setPixData(null)}
                variant="outline"
                className="flex-1"
              >
                Gerar Novo PIX
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
