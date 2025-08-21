import { Heart, Shield, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import campaignHero from "@/assets/campaign-hero.jpg";

interface CampaignHeaderProps {
  title: string;
  category: string;
  creatorName: string;
  isVerified: boolean;
  supportCount: number;
}

export const CampaignHeader = ({ 
  title, 
  category, 
  creatorName, 
  isVerified, 
  supportCount 
}: CampaignHeaderProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Campaign Image */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
        <img 
          src={campaignHero} 
          alt={title}
          className="w-full h-auto object-contain transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Category Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <Badge variant="secondary" className="bg-success-light text-success px-3 py-1 w-fit">
          {category}
        </Badge>
        {isVerified && (
          <div className="flex items-center gap-1 text-success">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Criador Verificado</span>
          </div>
        )}
      </div>

      {/* Campaign Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
        {title}
      </h1>

      {/* Creator Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="https://sdmntprcentralus.oaiusercontent.com/files/00000000-697c-61f5-a70d-20624a51b1e7/raw?se=2025-08-21T03%3A31%3A36Z&sp=r&sv=2024-08-04&sr=b&scid=8af85b67-dc93-5cae-806e-e484f510ec23&skoid=77636ecc-ad8d-44df-baa7-163b524a0261&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-20T20%3A03%3A52Z&ske=2025-08-21T20%3A03%3A52Z&sks=b&skv=2024-08-04&sig=2g1hDGJ5ZPaNLZaykiT%2BZyM35UeNLc3cUjm2r4YU1ME%3D" 
              alt="Logo Faze o Bem" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm sm:text-base">Faze o bem ONG</p>
            <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
              <span>Membro desde 2023</span>
            </div>
          </div>
        </div>

        {/* Support Button */}
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary hover:bg-primary/10 w-fit">
          <Heart className="w-4 h-4" />
          <span className="text-sm sm:text-base">{supportCount}</span>
        </Button>
      </div>
    </div>
  );
};