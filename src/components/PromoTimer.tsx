import { useState, useEffect } from "react";
import { Flame, Clock } from "lucide-react";

const PromoTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 47,
    seconds: 33,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer when it reaches 0
          hours = 2;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="bg-gradient-to-r from-destructive/20 via-destructive/10 to-destructive/20 border border-destructive/30 rounded-2xl p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Promo Text */}
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-destructive animate-pulse" />
          <span className="font-display font-bold text-lg md:text-xl">
            PROMOÇÃO RELÂMPAGO
          </span>
          <Flame className="w-6 h-6 text-destructive animate-pulse" />
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <div className="bg-card px-3 py-2 rounded-lg border border-border">
              <span className="font-display font-bold text-xl text-primary">
                {formatNumber(timeLeft.hours)}
              </span>
            </div>
            <span className="text-xl font-bold text-muted-foreground">:</span>
            <div className="bg-card px-3 py-2 rounded-lg border border-border">
              <span className="font-display font-bold text-xl text-primary">
                {formatNumber(timeLeft.minutes)}
              </span>
            </div>
            <span className="text-xl font-bold text-muted-foreground">:</span>
            <div className="bg-card px-3 py-2 rounded-lg border border-border">
              <span className="font-display font-bold text-xl text-primary">
                {formatNumber(timeLeft.seconds)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Description */}
      <p className="text-center text-sm text-muted-foreground mt-3">
        🎁 <span className="text-primary font-semibold">10% EXTRA</span> em todos os pacotes durante a promoção!
      </p>
    </div>
  );
};

export default PromoTimer;
