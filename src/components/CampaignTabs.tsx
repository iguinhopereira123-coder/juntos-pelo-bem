import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Comment {
  id: string;
  user: string;
  message: string;
  amount?: number;
  createdAt: Date;
  isSupporter: boolean;
}

interface Update {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface Supporter {
  id: string;
  name: string;
  amount: number;
  isAnonymous: boolean;
  createdAt: Date;
}

interface CampaignTabsProps {
  description: string;
  updates: Update[];
  supporters: Supporter[];
  comments: Comment[];
}

export const CampaignTabs = ({ 
  description, 
  updates, 
  supporters, 
  comments 
}: CampaignTabsProps) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  return (
    <Tabs defaultValue="about" className="w-full">
      <div className="relative">
        <TabsList className="grid w-full grid-cols-3 gap-1 sm:gap-2 mb-4 sm:mb-6">
        <TabsTrigger value="about" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
          Sobre
        </TabsTrigger>
        <TabsTrigger value="updates" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
          Novidades
          {updates.length > 0 && (
            <Badge variant="secondary" className="ml-1 sm:ml-2 bg-primary text-primary-foreground text-xs">
              {updates.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="comments" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
          Comentários ({comments.length})
        </TabsTrigger>
      </TabsList>
      </div>

      <TabsContent value="about" className="space-y-4 sm:space-y-6">
        <Card className="p-4 sm:p-6">
          <div className="prose prose-sm sm:prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed text-sm sm:text-base">
              {description}
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="updates" className="space-y-3 sm:space-y-4">
        {updates.length > 0 ? (
          updates.map((update) => (
            <Card key={update.id} className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 sm:mt-3" />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="font-semibold text-base sm:text-lg">{update.title}</h3>
                    <Badge variant="secondary" className="text-xs w-fit">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(update.createdAt, { locale: ptBR, addSuffix: true })}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {update.content}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 sm:p-8 text-center">
            <p className="text-muted-foreground text-sm sm:text-base">Nenhuma novidade ainda.</p>
          </Card>
        )}
      </TabsContent>



      <TabsContent value="comments" className="space-y-4">
        {/* Header with comment count */}
        <div className="border-b border-border pb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Mostrando {comments.length} Comentários
          </h3>
        </div>

        <div className="space-y-6">
          {comments.map((comment) => {
            // Mapeamento das imagens de perfil dos usuários
            const userImages: { [key: string]: string } = {
              "Pedro Henrique": "https://ajude-isabela-nu.vercel.app/images/220ng6919Yif.webp",
              "Cicera Rodrigues": "https://ajude-isabela-nu.vercel.app/images/ECeqO0WJ2O13.webp",
              "Gabriela Oliveira": "https://ajude-isabela-nu.vercel.app/images/99KcATmq8vkA.webp",
              "Letícia Mara": "https://ajude-isabela-nu.vercel.app/images/EOF0KAbxK7So.webp"
            };

            const userImage = userImages[comment.user];
            
            return (
            <div key={comment.id} className="flex gap-3">
              {/* User Avatar with actual image or fallback */}
              <div className="flex-shrink-0">
                {userImage ? (
                  <img 
                    src={userImage} 
                    alt={`Foto de ${comment.user}`}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback para ícone se a imagem falhar
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center ${userImage ? 'hidden' : ''}`}>
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              
              {/* Comment Content */}
              <div className="flex-1 space-y-2">
                {/* User name */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-base">
                    {comment.user}
                  </span>
                </div>
                
                {/* Comment text */}
                <p className="text-foreground text-sm leading-relaxed">
                  {comment.message}
                </p>
                
                {/* Action buttons and timestamp */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button className="hover:text-primary transition-colors font-medium">
                    Responder
                  </button>
                  <span>•</span>
                  <button className="hover:text-primary transition-colors font-medium">
                    Curtir
                  </button>
                  <span>•</span>
                  <button className="hover:text-primary transition-colors font-medium">
                    Seguir
                  </button>
                  <span>•</span>
                  <span className="text-xs">
                    {formatDistanceToNow(comment.createdAt, { locale: ptBR, addSuffix: true }).replace('há ', '')}
                  </span>
                </div>
              </div>
            </div>
          );
          })}
        </div>

        {/* Login prompt */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Você precisa estar logado para comentar.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};