import { Star, Users, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Lucas M.",
    message: "Recebi em menos de 3 minutos! Incrível!",
    stars: 5,
    avatar: "LM",
  },
  {
    name: "Ana Paula",
    message: "Melhor loja de Robux do Brasil, super confiável!",
    stars: 5,
    avatar: "AP",
  },
  {
    name: "Gabriel S.",
    message: "Já comprei 5 vezes, sempre entrega rápida!",
    stars: 5,
    avatar: "GS",
  },
];

const stats = [
  { value: "1.300+", label: "Clientes Satisfeitos" },
  { value: "11.200+", label: "Entregas Realizadas" },
  { value: "4.9/5", label: "Avaliação Média" },
];

const SocialProof = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-card/50 border border-border"
            >
              <div className="text-2xl md:text-3xl font-display font-bold text-primary text-glow">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            O que nossos <span className="text-primary text-glow">clientes</span> dizem
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-xl card-gradient border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    {testimonial.name}
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                "{testimonial.message}"
              </p>
            </div>
          ))}
        </div>

        {/* Live Activity */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary" />
          <span>
            <span className="text-primary font-semibold">23 pessoas</span> compraram nos últimos 30 minutos
          </span>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
