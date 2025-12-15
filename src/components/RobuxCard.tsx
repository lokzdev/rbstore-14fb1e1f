import { Button } from "@/components/ui/button";

export interface RobuxPackage {
  id: string;
  name: string;
  robux: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

interface RobuxCardProps {
  package_: RobuxPackage;
  onBuy: (pkg: RobuxPackage) => void;
}

export function RobuxCard({ package_, onBuy }: RobuxCardProps) {
  const totalRobux = package_.robux + (package_.bonus || 0);
  
  return (
    <div 
      className={`
        relative card-gradient rounded-xl p-6 border transition-all duration-300
        hover:scale-105 hover:box-glow group
        ${package_.popular 
          ? 'border-primary box-glow-sm' 
          : 'border-border hover:border-primary/50'
        }
      `}
    >
      {package_.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 hero-gradient rounded-full text-xs font-bold uppercase tracking-wider text-primary-foreground">
          Mais Popular
        </div>
      )}
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-float">
            <img src="/robux.png" alt="Robux" className="w-12 h-12" />
          </div>
          {package_.bonus && (
            <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
              +{package_.bonus}
            </div>
          )}
        </div>
        
        <div className="text-center">
          <h3 className="font-display text-xl font-bold text-foreground">
            {package_.name}
          </h3>
          <p className="text-3xl font-display font-bold text-primary text-glow mt-2">
            {totalRobux.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-muted-foreground">Robux</p>
        </div>
        
        <div className="w-full pt-4 border-t border-border/50">
          <p className="text-2xl font-bold text-center mb-4">
            R$ {package_.price.toFixed(2).replace('.', ',')}
          </p>
          <Button 
            className="w-full font-display uppercase tracking-wider transition-all duration-300 group-hover:animate-pulse-glow"
            onClick={() => onBuy(package_)}
          >
            Comprar Agora
          </Button>
        </div>
      </div>
    </div>
  );
}
