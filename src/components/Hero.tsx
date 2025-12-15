import { Sparkles, Zap, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Entrega rápida e segura</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Compre <span className="text-primary text-glow">Robux</span> com{' '}
            <span className="text-primary text-glow">PIX</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            A forma mais rápida e segura de adquirir Robux para sua conta Roblox. 
            Pagamento instantâneo via PIX!
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <span>Entrega em 24h</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span>Melhor Preço</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
