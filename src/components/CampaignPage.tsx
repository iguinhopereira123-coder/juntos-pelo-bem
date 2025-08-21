import { useState, useEffect } from "react";
import { CampaignHeader } from "./CampaignHeader";
import { DonationSidebar } from "./DonationSidebar";
import { CampaignTabs } from "./CampaignTabs";
import { DonationNotification } from "./DonationNotification";
import { PixCheckoutDialog } from "./PixCheckoutDialog";
import logoSvg from "@/assets/logo.svg";

// Mock data - In a real app, this would come from an API
const mockCampaign = {
  title: "Ajude a Isabela a Vencer o Câncer",
  category: "Saúde • Tratamentos",
  creatorName: "Maria Silva",
  isVerified: true,
  supportCount: 1247,
  raised: 18654.28,
  goal: 80000,
  supporters: 342,
  daysLeft: 28,
  description: `O velório já estava sendo preparado. A família inteira foi chamada às pressas — não para comemorar um aniversário, mas para se despedir de uma criança que ainda está viva. Médicos disseram que ela não passaria da noite. A febre não cedia. O corpo já estava entrando em colapso. Foi então que, no meio do desespero, encontraram uma única dose do medicamento que poderia salvá-la. Aplicaram. E, por um milagre da ciência, ela reagiu. Abriu os olhos. Respirou melhor. Disse baixinho: "Eu quero viver."

Mas a dose acabou. E o remédio completo custa R$ 260.000. A família vendeu tudo: móveis, roupas, a casa, alianças. Conseguiram parte do valor. Mas ainda falta muito. E falta tempo. Cada hora que passa, o risco de perder ela para sempre aumenta.

Essa vaquinha é a última esperança. É o último grito de socorro de quem não quer enterrar uma criança tão nova, tão cheia de sonhos, tão inocente. Se você está lendo isso, é porque algo dentro de você foi tocado. Por favor, ajude com o que puder. R$ 10, R$ 50, R$ 100 — qualquer valor é um pedaço de vida que pode ser devolvido a ela.

Clique em "Quero" e faça parte da salvação. Antes que seja tarde demais.

Ajudar a Isabela é simples:

✔️ Clique no botão "Quero Ajudar".

✔️ Escolha o valor que deseja doar.

✔️ Você será direcionado para a próxima etapa, onde poderá efetuar a doação via PIX.

Cada doação, por menor que seja, faz uma grande diferença. Todo o valor arrecadado

é para garantir o tratamento de Isabela.

Podemos contar com vocês?`,
  updates: [
    {
      id: "1",
      title: "Boa notícia: Resultados do último exame!",
      content: "Pessoal, acabamos de receber os resultados dos exames da Isabela e as notícias são muito boas! O tumor diminuiu 40% desde o início do tratamento. Os médicos estão otimistas e isso nos dá ainda mais força para continuar. Obrigada a todos que estão nos apoiando! ❤️",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 horas atrás
    },
    {
      id: "2", 
      title: "Isabela está animada com o apoio de vocês",
      content: "A Isabela ficou muito emocionada ao saber que tantas pessoas estão torcendo por ela. Ela quer que eu agradeça a cada um de vocês. Anexei uma foto dela pintando um desenho para vocês!",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 horas atrás
    },
    {
      id: "3",
      title: "Nova meta alcançada! 🎉",
      content: "Graças ao apoio incrível de vocês, conseguimos arrecadar mais de R$ 18.000! Estamos muito próximos de 25% da meta. Cada doação faz a diferença na vida da Isabela. Obrigada a todos! 🙏",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 horas atrás
    }
  ],
  supportersList: [
    { id: "1", name: "Ana Paula", amount: 500, isAnonymous: false, createdAt: new Date(2024, 0, 16, 14, 30) },
    { id: "2", name: "João Santos", amount: 200, isAnonymous: false, createdAt: new Date(2024, 0, 16, 12, 15) },
    { id: "3", name: "Doador anônimo", amount: 1000, isAnonymous: true, createdAt: new Date(2024, 0, 16, 10, 45) },
    { id: "4", name: "Carla Mendes", amount: 150, isAnonymous: false, createdAt: new Date(2024, 0, 15, 18, 20) },
    { id: "5", name: "Roberto Lima", amount: 300, isAnonymous: false, createdAt: new Date(2024, 0, 15, 16, 10) }
  ],
  comments: [
    {
      id: "1",
      user: "Ana Clara",
      message: "Eu ajudei com 150 reais, pois eu conheço essa família, dó no coração ver tanta dor que eles passam.",
      amount: 150,
      createdAt: new Date(Date.now() - 3 * 60 * 1000), // 3 min atrás
      isSupporter: true
    },
    {
      id: "2",
      user: "Pedro Henrique",
      message: "Ajudei de coração mesmo, olha que situação complicada...",
      amount: 200,
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 min atrás
      isSupporter: true
    },
    {
      id: "3",
      user: "Cicera Rodrigues",
      message: "Cada doação importa. Isabela merece nosso apoio!",
      amount: 100,
      createdAt: new Date(Date.now() - 9 * 60 * 1000), // 9 min atrás
      isSupporter: true
    },
    {
      id: "4",
      user: "Meire Fonseca",
      message: "Muito triste gente!",
      createdAt: new Date(Date.now() - 14 * 60 * 1000), // 14 min atrás
      isSupporter: false
    },
    {
      id: "5",
      user: "Gabriela Oliveira",
      message: "Aqui eu ajudei com 50 reais, queria poder doar um pouco mais 😥",
      amount: 50,
      createdAt: new Date(Date.now() - 6 * 60 * 1000), // 6 min atrás
      isSupporter: true
    },
    {
      id: "6",
      user: "Letícia Mara",
      message: "Vamos apoiar essa família!",
      amount: 75,
      createdAt: new Date(Date.now() - 1 * 60 * 1000), // 1 min atrás
      isSupporter: true
    }
  ]
};

export const CampaignPage = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [currentDonation, setCurrentDonation] = useState({ name: "", amount: 0 });
  const [totalRaised, setTotalRaised] = useState(mockCampaign.raised);
  const [showPixCheckout, setShowPixCheckout] = useState(false);
  const [supportersCount, setSupportersCount] = useState(mockCampaign.supporters);
  const [supportersList, setSupportersList] = useState(mockCampaign.supportersList);
  const [comments, setComments] = useState(mockCampaign.comments);

  // Simulate real-time donations
  useEffect(() => {
    const interval = setInterval(() => {
      const donors = ["João Silva", "Maria Santos", "Doador anônimo", "Ana Costa", "Pedro Lima"];
      const amounts = [50, 100, 200, 300, 500];
      
      const newDonation = {
        name: donors[Math.floor(Math.random() * donors.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)]
      };
      
      // Atualizar todos os estados necessários
      setCurrentDonation(newDonation);
      setTotalRaised(prev => prev + newDonation.amount);
      setSupportersCount(prev => prev + 1); // Incrementar contador de apoiadores
      
      // Adicionar novo apoiador à lista
      const newSupporter = {
        id: `supporter_${Date.now()}`,
        name: newDonation.name,
        amount: newDonation.amount,
        isAnonymous: newDonation.name === "Doador anônimo",
        createdAt: new Date()
      };
      setSupportersList(prev => [newSupporter, ...prev]);
      
      setShowNotification(true);
    }, 10000); // Show notification every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDonate = () => {
    setShowPixCheckout(true);
  };

  const handleDonationSuccess = (donation: {
    name: string;
    amount: number;
    email: string;
    comment?: string;
  }) => {
    // Atualizar valor arrecadado
    setTotalRaised(prev => prev + donation.amount);
    
    // Atualizar contador de apoiadores
    setSupportersCount(prev => prev + 1);
    
    // Adicionar novo apoiador à lista
    const newSupporter = {
      id: `supporter_${Date.now()}`,
      name: donation.name,
      amount: donation.amount,
      isAnonymous: false,
      createdAt: new Date()
    };
    
    setSupportersList(prev => [newSupporter, ...prev]);
    
    // Atualizar notificação em tempo real
    setCurrentDonation({
      name: donation.name,
      amount: donation.amount
    });
    setShowNotification(true);
    
    // Adicionar comentário se fornecido
    if (donation.comment) {
      const newComment = {
        id: `comment_${Date.now()}`,
        user: donation.name,
        message: donation.comment,
        amount: donation.amount,
        createdAt: new Date(),
        isSupporter: true
      };
      
      setComments(prev => [newComment, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              src={logoSvg} 
              alt="Logo da plataforma" 
              className="h-6 sm:h-8 w-auto"
            />
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Campanhas
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Como Funciona
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Criar Campanha
              </a>
            </nav>
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Campaign Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8 order-2 lg:order-1">
            <CampaignHeader
              title={mockCampaign.title}
              category={mockCampaign.category}
              creatorName={mockCampaign.creatorName}
              isVerified={mockCampaign.isVerified}
              supportCount={supportersCount}
            />
            
            <CampaignTabs
              description={mockCampaign.description}
              updates={mockCampaign.updates}
              supporters={supportersList}
              comments={comments}
            />
          </div>

          {/* Right Column - Donation Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <DonationSidebar
              raised={totalRaised}
              goal={mockCampaign.goal}
              supporters={supportersCount}
              daysLeft={mockCampaign.daysLeft}
              onDonate={handleDonate}
            />
          </div>
        </div>
      </main>

      {/* Real-time Donation Notification */}
      <DonationNotification
        donorName={currentDonation.name}
        amount={currentDonation.amount}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />

      {/* PIX Checkout Dialog */}
      <PixCheckoutDialog
        isOpen={showPixCheckout}
        onClose={() => setShowPixCheckout(false)}
        campaignTitle={mockCampaign.title}
        goal={mockCampaign.goal}
        onDonationSuccess={handleDonationSuccess}
      />
    </div>
  );
};