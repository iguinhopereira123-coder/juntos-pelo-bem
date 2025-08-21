import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle, Heart, Gift, Sparkles, CreditCard, Shield, Target } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { PixAPI, PixData } from "@/lib/pix-api";

interface PixCheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
  goal: number;
  onDonationSuccess?: (donation: {
    name: string;
    amount: number;
    email: string;
    comment?: string;
  }) => void;
}

export const PixCheckoutDialog = ({ 
  isOpen, 
  onClose, 
  campaignTitle, 
  goal,
  onDonationSuccess
}: PixCheckoutDialogProps) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorComment, setDonorComment] = useState("");
  const [showPixCode, setShowPixCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

  const handleDonate = async () => {
    if (!donationAmount || !donorName || !donorEmail) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(donationAmount);
    if (amount < 5) {
      toast({
        title: "Valor mínimo",
        description: "O valor mínimo para doação é R$ 5,00.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPix(true);

    try {
      // Gerar PIX usando PushinPay
      const pixResponse = await PixAPI.generatePix({
        amount: amount,
        description: `Doação para ${campaignTitle} - ${donorName}`,
        customerName: donorName,
        customerEmail: donorEmail,
        customerComment: donorComment
      });

      // Atualizar dados do PIX
      setPixData(pixResponse);

      setShowPixCode(true);
      
      // Iniciar verificação automática de status
      startStatusCheck(pixResponse.transactionId);
      
      // Chamar callback de sucesso para atualizar o site
      if (onDonationSuccess) {
        onDonationSuccess({
          name: donorName,
          amount: amount,
          email: donorEmail,
          comment: donorComment
        });
      }
      
      toast({
        title: "PIX gerado com sucesso!",
        description: "Escaneie o QR Code para fazer o pagamento via PushinPay.",
      });

    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      toast({
        title: "Erro ao gerar PIX",
        description: error instanceof Error ? error.message : "Tente novamente ou entre em contato conosco.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const copyPixKey = async () => {
    if (!pixData) return;
    
    try {
      await navigator.clipboard.writeText(pixData.pixKey);
      setCopied(true);
      toast({
        title: "Chave PIX copiada!",
        description: "Cole no seu app bancário para fazer o pagamento.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente a chave PIX.",
        variant: "destructive"
      });
    }
  };

  const startStatusCheck = (transactionId: string) => {
    // Verificar status a cada 10 segundos
    const interval = setInterval(async () => {
      try {
        const status = await PixAPI.checkPixStatus(transactionId);
        if (status) {
          setPixData(status);
          
          if (status.status === 'paid') {
            toast({
              title: "Pagamento confirmado! 🎉",
              description: "Obrigado pela sua doação!",
            });
            clearInterval(interval);
            setStatusCheckInterval(null);
          } else if (status.status === 'expired') {
            toast({
              title: "PIX expirado",
              description: "Gere um novo PIX para continuar.",
              variant: "destructive"
            });
            clearInterval(interval);
            setStatusCheckInterval(null);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 10000); // 10 segundos
    
    setStatusCheckInterval(interval);
  };

  const checkPixStatus = async () => {
    if (!pixData?.transactionId) return;
    
    setIsCheckingStatus(true);
    try {
      const status = await PixAPI.checkPixStatus(pixData.transactionId);
      if (status) {
        setPixData(status);
        
        if (status.status === 'paid') {
          toast({
            title: "Pagamento confirmado! 🎉",
            description: "Obrigado pela sua doação!",
          });
        } else if (status.status === 'pending') {
          toast({
            title: "Pagamento pendente",
            description: "Aguardando confirmação do pagamento.",
          });
        } else if (status.status === 'expired') {
          toast({
            title: "PIX expirado",
            description: "Gere um novo PIX para continuar.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro ao verificar status",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  const resetForm = () => {
    setDonationAmount("");
    setDonorName("");
    setDonorEmail("");
    setDonorComment("");
    setShowPixCode(false);
    setCopied(false);
    setIsGeneratingPix(false);
    setPixData(null);
    setIsCheckingStatus(false);
    
    // Limpar intervalo de verificação de status
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center space-y-2 sm:space-y-3">
            {!showPixCode ? (
              <>
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  Fazer Doação
                </DialogTitle>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Sua ajuda faz toda a diferença! ❤️
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  Pagamento via PIX
                </DialogTitle>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Escaneie o QR Code para finalizar
                </p>
              </>
            )}
          </div>
        </DialogHeader>

        {!showPixCode ? (
          <div className="space-y-4">
            <Card className="p-3 sm:p-4 bg-gradient-to-r from-success/5 to-primary/5 border-success/20">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-success">
                  <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Campanha Ativa</span>
                </div>
                <p className="text-foreground font-medium text-sm sm:text-base">
                  {campaignTitle}
                </p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Meta: {formatCurrency(goal)}</span>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium">Valor da doação (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    min="5"
                    step="0.01"
                    className="text-base h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Seu nome</Label>
                  <Input
                    id="name"
                    placeholder="Digite seu nome completo"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="text-base h-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Seu e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="text-base h-12"
                />
              </div>

              <div>
                <Label htmlFor="comment" className="text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Mensagem de apoio (opcional)
                  </span>
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Deixe uma mensagem de carinho e apoio para a campanha..."
                  value={donorComment}
                  onChange={(e) => setDonorComment(e.target.value)}
                  className="min-h-[80px] resize-none text-base"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {donorComment.length}/200 caracteres
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleDonate}
                className="w-full bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white text-lg py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={!donationAmount || !donorName || !donorEmail || isGeneratingPix}
              >
                {isGeneratingPix ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    <span>Gerando PIX...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    <span>Gerar PIX</span>
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span className="text-center">Pagamento 100% seguro via PIX</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
                             <p className="text-lg font-semibold text-success mb-2">
                 Doação de {pixData ? PixAPI.formatAmount(pixData.amount) : formatCurrency(parseFloat(donationAmount))}
               </p>
              <p className="text-sm text-muted-foreground">
                Escaneie o QR Code ou copie a chave PIX
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <Card className="p-6 border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="text-center space-y-3">
                  <div className="relative">
                    <img 
                      src={pixData?.qrCode || ''} 
                      alt="QR Code PIX" 
                      className="w-40 h-40 mx-auto drop-shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">
                      QR Code PIX Ativo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Escaneie com seu app bancário
                    </p>
                  </div>
                </div>
              </Card>
            </div>

             {/* PIX Key */}
             <Card className="p-4 bg-muted/30 border-primary/20">
               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                     <CreditCard className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                     <Label className="text-sm font-medium">Chave PIX ({pixData?.pixKeyType || 'phone'})</Label>
                     <p className="text-xs text-muted-foreground">Copie e cole no seu app bancário</p>
                   </div>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                   <Input
                     value={pixData?.pixKey || ''}
                     readOnly
                     className="font-mono text-sm bg-background h-12"
                   />
                   <Button
                     size="sm"
                     variant={copied ? "default" : "outline"}
                     onClick={copyPixKey}
                     className={`min-w-[100px] h-12 transition-all duration-200 ${
                       copied ? "bg-success hover:bg-success/90" : ""
                     }`}
                   >
                     {copied ? (
                       <>
                         <CheckCircle className="w-4 h-4 mr-1" />
                         <span className="text-sm">Copiado</span>
                       </>
                     ) : (
                       <>
                         <Copy className="w-4 h-4 mr-1" />
                         <span className="text-sm">Copiar</span>
                       </>
                     )}
                   </Button>
                 </div>
               </div>
             </Card>

             {/* Código Copia e Cola */}
             <Card className="p-4 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                     <Copy className="w-4 h-4 text-success" />
                   </div>
                   <div>
                     <Label className="text-sm font-medium">Código Copia e Cola</Label>
                     <p className="text-xs text-muted-foreground">Cole este código no seu app bancário</p>
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <Textarea
                     value={pixData?.copyPasteCode || ''}
                     readOnly
                     className="font-mono text-sm bg-background min-h-[80px] resize-none"
                     placeholder="Código PIX sendo gerado..."
                   />
                   <div className="flex justify-between items-center">
                     <p className="text-xs text-muted-foreground">
                       Código PIX válido para pagamento
                     </p>
                     <Button
                       size="sm"
                       variant={copied ? "default" : "outline"}
                       onClick={() => {
                         if (pixData?.copyPasteCode) {
                           navigator.clipboard.writeText(pixData.copyPasteCode);
                           setCopied(true);
                           toast({
                             title: "Código copiado!",
                             description: "Cole no seu app bancário para fazer o pagamento.",
                           });
                           setTimeout(() => setCopied(false), 2000);
                         }
                       }}
                       className={`min-w-[100px] h-10 transition-all duration-200 ${
                         copied ? "bg-success hover:bg-success/90" : ""
                       }`}
                       disabled={!pixData?.copyPasteCode}
                     >
                       {copied ? (
                         <>
                           <CheckCircle className="w-4 h-4 mr-1" />
                           <span className="text-sm">Copiado</span>
                         </>
                       ) : (
                         <>
                           <Copy className="w-4 h-4 mr-1" />
                           <span className="text-sm">Copiar</span>
                         </>
                       )}
                     </Button>
                   </div>
                 </div>
               </div>
             </Card>

            {/* Status Check */}
            <Card className="p-3 sm:p-4 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">Status do Pagamento</h4>
                    <p className="text-xs text-muted-foreground">Verificação automática ativa</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      pixData?.status === 'paid' ? 'bg-success' : 
                      pixData?.status === 'expired' ? 'bg-destructive' : 'bg-warning'
                    }`} />
                    <span className="text-xs sm:text-sm font-medium capitalize">
                      {pixData?.status === 'paid' ? 'Pago' : 
                       pixData?.status === 'expired' ? 'Expirado' : 'Pendente'}
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={checkPixStatus}
                    disabled={isCheckingStatus}
                    className="text-xs"
                  >
                    {isCheckingStatus ? (
                      <>
                        <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-1" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificar Status
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-3 sm:p-4 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">Como pagar via PIX:</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {PixAPI.getPaymentInstructions().map((instruction, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* PushinPay Info */}
            <Card className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm sm:text-base">Powered by PushinPay</h4>
                    <p className="text-xs text-blue-700">Pagamento seguro e confiável</p>
                  </div>
                </div>
                
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• Transação ID: {pixData?.transactionId || 'N/A'}</p>
                  <p>• Processado por PushinPay</p>
                  <p>• Criptografia de ponta a ponta</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPixCode(false)}
                  className="flex-1"
                >
                  <span className="text-sm sm:text-base">← Voltar</span>
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70"
                >
                  <span className="text-sm sm:text-base">✓ Finalizar</span>
                </Button>
              </div>
              
                             <div className="text-center">
                 <p className="text-xs text-muted-foreground">
                   PIX válido por 30 minutos • Chave: {pixData?.pixKey || '19998353715'} • Código copia e cola disponível
                 </p>
               </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
