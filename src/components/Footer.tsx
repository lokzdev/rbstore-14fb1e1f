export function Footer() {
  return <footer className="border-t border-border/50 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="RobuxShop Logo" className="w-8 h-8 rounded-lg" />
            <span className="font-display text-lg font-bold">​RBstore</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            ​Compre com garantia qualidade e agilidade!     
          </p>
          
          <p className="text-sm text-muted-foreground">
            © 2024 RobuxShop. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>;
}