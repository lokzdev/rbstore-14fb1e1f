import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { RobuxCard, type RobuxPackage } from "@/components/RobuxCard";
import { CheckoutModal } from "@/components/CheckoutModal";
import PromoTimer from "@/components/PromoTimer";
import SocialProof from "@/components/SocialProof";
import { UserCheck, CreditCard, Gift, HelpCircle } from "lucide-react";
const robuxPackages: RobuxPackage[] = [{
  id: "pkg-500",
  name: "Starter",
  robux: 500,
  price: 19.90
}, {
  id: "pkg-800",
  name: "Basic",
  robux: 800,
  price: 24.90
}, {
  id: "pkg-1700",
  name: "Popular",
  robux: 1700,
  bonus: 100,
  price: 49.90,
  popular: true
}, {
  id: "pkg-4500",
  name: "Premium",
  robux: 4500,
  bonus: 300,
  price: 129.90
}, {
  id: "pkg-10000",
  name: "Ultimate",
  robux: 10000,
  bonus: 1000,
  price: 279.90
}];
const Index = () => {
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleBuy = (pkg: RobuxPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };
  return <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        
        {/* Promo Timer */}
        <section className="py-8 px-4">
          <PromoTimer />
        </section>
        
        {/* Packages Section */}
        <section id="pacotes" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Escolha seu <span className="text-primary text-glow">Pacote</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Selecione a quantidade de Robux que deseja comprar. 
                Quanto maior o pacote, melhor o custo-benefício!
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {robuxPackages.map(pkg => <RobuxCard key={pkg.id} package_={pkg} onBuy={handleBuy} />)}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="como-funciona" className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Como <span className="text-primary text-glow">Funciona</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center mb-4">
                  <UserCheck className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">1. Escolha e Informe</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione o pacote desejado e informe seu usuário do Roblox
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">2. Pague com PIX</h3>
                <p className="text-sm text-muted-foreground">
                  Escaneie o QR Code ou copie o código PIX para pagar
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center mb-4">
                  <Gift className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">3. Receba seus Robux</h3>
                <p className="text-sm text-muted-foreground">
                  Após a confirmação, os Robux são enviados em até 5 minutos  
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <SocialProof />

        {/* FAQ Section */}
        <section id="faq" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Perguntas <span className="text-primary text-glow">Frequentes</span>
              </h2>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-4">
              {[{
              q: "Como os Robux são enviados?",
              a: "Enviamos os Robux através do sistema de Game Pass do Roblox. Você receberá instruções por e-mail."
            }, {
              q: "Quanto tempo demora para receber?",
              a: "Após a confirmação do pagamento, os Robux são enviados em até 5 minutos."
            }, {
              q: "O pagamento é seguro?",
              a: "Sim! Utilizamos a plataforma SigiloPay para processar os pagamentos PIX com total segurança."
            }, {
              q: "Posso cancelar minha compra?",
              a: "Após o pagamento confirmado, não é possível cancelar. Certifique-se de informar o usuário correto."
            }].map((item, index) => <div key={index} className="p-5 rounded-lg card-gradient border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold mb-2">{item.q}</h3>
                      <p className="text-sm text-muted-foreground">{item.a}</p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} package_={selectedPackage} />
    </div>;
};
export default Index;