import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Target, Calendar, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface DonationSidebarProps {
  raised: number;
  goal: number;
  supporters: number;
  daysLeft?: number;
  onDonate: () => void;
}

export const DonationSidebar = ({ 
  raised, 
  goal, 
  supporters, 
  daysLeft, 
  onDonate 
}: DonationSidebarProps) => {
  const [prevSupporters, setPrevSupporters] = useState(supporters);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const percentage = Math.min((raised / goal) * 100, 100);
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  // Animar quando o número de apoiadores aumentar
  useEffect(() => {
    if (supporters > prevSupporters) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
    setPrevSupporters(supporters);
  }, [supporters, prevSupporters]);

  return (
    <div className="sticky top-4 sm:top-6 space-y-4 sm:space-y-6">
      <Card className="p-4 sm:p-6 card-elevated">
        {/* Progress Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Arrecadado</span>
              <span className="text-2xl font-bold text-success">
                {formatCurrency(raised)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Meta</span>
              <span className="text-lg font-semibold text-foreground">
                {formatCurrency(goal)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={percentage} className="h-3" />
            <div className="text-right">
              <span className="text-sm font-medium text-success">
                {percentage.toFixed(1)}% alcançado
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <div>
              <p className={`text-base sm:text-lg font-bold text-foreground transition-all duration-500 ${
                isAnimating ? 'scale-110 text-success' : ''
              }`}>
                {supporters}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Apoiadores</p>
            </div>
          </div>
          
          {daysLeft && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
              <div>
                <p className="text-base sm:text-lg font-bold text-foreground">{daysLeft}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Dias restantes</p>
              </div>
            </div>
          )}
        </div>

        {/* Donation Button */}
        <Button 
          onClick={onDonate}
          className="w-full mt-4 sm:mt-6 bg-success hover:bg-success/90 text-white text-base sm:text-lg py-4 sm:py-6 font-semibold"
        >
          Quero Ajudar
        </Button>
      </Card>

      {/* Trust Card */}
      <Card className="p-3 sm:p-4 bg-success-light border-success/20">
        <div className="flex items-start gap-2 sm:gap-3">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-success mt-1" />
          <div>
            <h3 className="font-semibold text-success mb-1 text-sm sm:text-base">Criador Verificado</h3>
            <p className="text-xs sm:text-sm text-success/80">
              Identidade confirmada pela nossa equipe de segurança
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};