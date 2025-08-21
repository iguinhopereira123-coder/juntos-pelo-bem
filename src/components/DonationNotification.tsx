import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationNotificationProps {
  donorName: string;
  amount: number;
  isVisible: boolean;
  onClose: () => void;
}

export const DonationNotification = ({ 
  donorName, 
  amount, 
  isVisible, 
  onClose 
}: DonationNotificationProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      // Remove confetti after animation
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearTimeout(confettiTimer);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Create confetti elements
  const confettiElements = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className="absolute w-3 h-3 confetti-animation"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
      }}
    />
  ));

  return (
    <>
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiElements}
        </div>
      )}

      {/* Notification */}
      <div className="fixed bottom-6 left-6 z-40 notification-slide">
        <div className="bg-white border border-success/20 rounded-xl shadow-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center text-white font-semibold shrink-0">
              {donorName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">
                <span className="text-success font-semibold">{donorName}</span> acabou de doar
              </p>
              <p className="text-lg font-bold text-success">
                {formatCurrency(amount)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="shrink-0 w-6 h-6 p-0 hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};