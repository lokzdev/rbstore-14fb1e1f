import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Zap } from "lucide-react";
import type { RobuxPackage } from "./RobuxCard";

interface CustomRobuxSelectorProps {
  onBuy: (pkg: RobuxPackage) => void;
}

const MIN_ROBUX = 500;
const MAX_ROBUX = 50000;
const STEP = 100;

// Price tiers based on existing packages
const PRICE_TIERS = [
  { robux: 500, price: 19.90, bonus: 0 },
  { robux: 800, price: 24.90, bonus: 0 },
  { robux: 1700, price: 49.90, bonus: 100 },
  { robux: 4500, price: 129.90, bonus: 300 },
  { robux: 10000, price: 279.90, bonus: 1000 },
];

// Interpolate price between tiers
const interpolatePrice = (robux: number): number => {
  // Find the surrounding tiers
  for (let i = 0; i < PRICE_TIERS.length - 1; i++) {
    const lower = PRICE_TIERS[i];
    const upper = PRICE_TIERS[i + 1];
    
    if (robux >= lower.robux && robux <= upper.robux) {
      const ratio = (robux - lower.robux) / (upper.robux - lower.robux);
      return lower.price + ratio * (upper.price - lower.price);
    }
  }
  
  // Extrapolate for values above the highest tier
  const lastTier = PRICE_TIERS[PRICE_TIERS.length - 1];
  const secondLastTier = PRICE_TIERS[PRICE_TIERS.length - 2];
  const pricePerRobux = (lastTier.price - secondLastTier.price) / (lastTier.robux - secondLastTier.robux);
  return lastTier.price + (robux - lastTier.robux) * pricePerRobux;
};

// Interpolate bonus between tiers
const interpolateBonus = (robux: number): number => {
  // Find the surrounding tiers
  for (let i = 0; i < PRICE_TIERS.length - 1; i++) {
    const lower = PRICE_TIERS[i];
    const upper = PRICE_TIERS[i + 1];
    
    if (robux >= lower.robux && robux <= upper.robux) {
      const ratio = (robux - lower.robux) / (upper.robux - lower.robux);
      return Math.floor(lower.bonus + ratio * (upper.bonus - lower.bonus));
    }
  }
  
  // Extrapolate for values above the highest tier
  const lastTier = PRICE_TIERS[PRICE_TIERS.length - 1];
  const bonusRatio = lastTier.bonus / lastTier.robux;
  return Math.floor(robux * bonusRatio);
};

export const CustomRobuxSelector = ({ onBuy }: CustomRobuxSelectorProps) => {
  const [robuxAmount, setRobuxAmount] = useState(MIN_ROBUX);
  const [inputValue, setInputValue] = useState(MIN_ROBUX.toString());

  const updateRobuxAmount = (value: number) => {
    const rounded = Math.round(value / STEP) * STEP;
    const clamped = Math.max(MIN_ROBUX, Math.min(MAX_ROBUX, rounded));
    setRobuxAmount(clamped);
    setInputValue(clamped.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setInputValue(rawValue);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue) || MIN_ROBUX;
    updateRobuxAmount(numValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const numValue = parseInt(inputValue) || MIN_ROBUX;
      updateRobuxAmount(numValue);
    }
  };

  const calculatedPrice = useMemo(() => {
    return interpolatePrice(robuxAmount).toFixed(2);
  }, [robuxAmount]);

  const bonus = useMemo(() => {
    return interpolateBonus(robuxAmount);
  }, [robuxAmount]);

  const handleBuy = () => {
    const customPackage: RobuxPackage = {
      id: `custom-${robuxAmount}`,
      name: "Personalizado",
      robux: robuxAmount,
      bonus: bonus > 0 ? bonus : undefined,
      price: parseFloat(calculatedPrice),
    };
    onBuy(customPackage);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-6 md:p-8">
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
          <h3 className="font-display text-2xl font-bold">Pacote Personalizado</h3>
        </div>

        <div className="space-y-6">
          {/* Robux Amount Display with Input */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <img 
                src="/robux.png" 
                alt="Robux" 
                className="w-10 h-10"
              />
              <Input
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                className="w-40 text-center font-display text-4xl font-bold text-primary bg-background/50 border-primary/30 focus:border-primary h-14"
              />
            </div>
            {bonus > 0 && (
              <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                <Zap className="w-4 h-4" />
                +{bonus.toLocaleString("pt-BR")} bônus
              </div>
            )}
          </div>

          {/* Slider */}
          <div className="px-2">
            <Slider
              value={[robuxAmount]}
              onValueChange={(value) => {
                setRobuxAmount(value[0]);
                setInputValue(value[0].toString());
              }}
              min={MIN_ROBUX}
              max={MAX_ROBUX}
              step={STEP}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{MIN_ROBUX.toLocaleString("pt-BR")}</span>
              <span>{MAX_ROBUX.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          {/* Price and Buy Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Valor total</p>
              <p className="font-display text-3xl font-bold text-primary">
                R$ {parseFloat(calculatedPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Button
              onClick={handleBuy}
              size="lg"
              className="w-full sm:w-auto hero-gradient text-primary-foreground font-bold px-8"
            >
              Comprar Agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
