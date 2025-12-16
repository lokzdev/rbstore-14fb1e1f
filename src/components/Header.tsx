import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export function Header() {
  return <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="RobuxShop Logo" className="w-10 h-10 rounded-lg" />
          <span className="font-display text-xl font-bold text-glow">
            ​RBstore
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#pacotes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pacotes
          </a>
          <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Como Funciona
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2 text-sm">
          <span className="hidden sm:inline text-muted-foreground">Pagamento via</span>
          <span className="font-bold text-primary">PIX</span>
        </div>
      </div>
    </header>;
}