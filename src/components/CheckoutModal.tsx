import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy, CheckCircle, QrCode, Clock, XCircle, PartyPopper } from "lucide-react";
import type { RobuxPackage } from "./RobuxCard";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  package_: RobuxPackage | null;
}

interface ClientData {
  name: string;
  email: string;
  phone: string;
  document: string;
  robloxUser: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  pixCode?: string;
  pixQrCode?: string;
  error?: string;
}

type PaymentStatus = 'pending' | 'paid' | 'failed';

export function CheckoutModal({ isOpen, onClose, package_ }: CheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    email: '',
    phone: '',
    document: '',
    robloxUser: '',
  });
  const [paymentData, setPaymentData] = useState<PaymentResult | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [isPolling, setIsPolling] = useState(false);
  const { toast } = useToast();

  const checkPaymentStatus = useCallback(async () => {
    if (!paymentData?.transactionId) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-pix-status', {
        body: { transactionId: paymentData.transactionId },
      });

      if (error) throw error;

      if (data.success) {
        setPaymentStatus(data.status);
        
        if (data.status === 'paid') {
          setIsPolling(false);
          toast({
            title: "Pagamento confirmado!",
            description: "Seus Robux serão enviados em instantes.",
          });
        } else if (data.status === 'failed') {
          setIsPolling(false);
          toast({
            title: "Pagamento expirado",
            description: "O tempo para pagamento expirou.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  }, [paymentData?.transactionId, toast]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (step === 'payment' && paymentData?.transactionId && paymentStatus === 'pending') {
      setIsPolling(true);
      interval = setInterval(checkPaymentStatus, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, paymentData?.transactionId, paymentStatus, checkPaymentStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!package_) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-pix-payment', {
        body: {
          amount: package_.price,
          productName: `${package_.robux + (package_.bonus || 0)} Robux`,
          productId: package_.id,
          quantity: 1,
          robuxAmount: package_.robux + (package_.bonus || 0),
          client: {
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone.replace(/\D/g, ''),
            document: clientData.document.replace(/\D/g, ''),
            robloxUser: clientData.robloxUser,
          },
        },
      });

      if (error) throw error;

      if (data.success) {
        setPaymentData(data);
        setStep('payment');
      } else {
        throw new Error(data.error || 'Erro ao criar pagamento');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (paymentData?.pixCode) {
      await navigator.clipboard.writeText(paymentData.pixCode);
      setCopied(true);
      toast({ title: "Código PIX copiado!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setStep('form');
    setClientData({ name: '', email: '', phone: '', document: '', robloxUser: '' });
    setPaymentData(null);
    setPaymentStatus('pending');
    setIsPolling(false);
    onClose();
  };

  if (!package_) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-center">
            {step === 'form' ? 'Finalizar Compra' : 'Pagamento PIX'}
          </DialogTitle>
        </DialogHeader>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
              <p className="text-sm text-muted-foreground">Você está comprando:</p>
              <p className="font-display text-xl text-primary">
                {(package_.robux + (package_.bonus || 0)).toLocaleString('pt-BR')} Robux
              </p>
              <p className="text-lg font-bold">
                R$ {package_.price.toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="robloxUser">Usuário Roblox</Label>
                <Input
                  id="robloxUser"
                  name="robloxUser"
                  value={clientData.robloxUser}
                  onChange={handleInputChange}
                  placeholder="Seu nome de usuário no Roblox"
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={clientData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={clientData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={clientData.phone}
                  onChange={(e) => setClientData(prev => ({ 
                    ...prev, 
                    phone: formatPhone(e.target.value) 
                  }))}
                  placeholder="(11) 99999-9999"
                  required
                  maxLength={15}
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="document">CPF</Label>
                <Input
                  id="document"
                  name="document"
                  value={clientData.document}
                  onChange={(e) => setClientData(prev => ({ 
                    ...prev, 
                    document: formatCPF(e.target.value) 
                  }))}
                  placeholder="000.000.000-00"
                  required
                  maxLength={14}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <Button type="submit" className="w-full font-display" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                'Gerar PIX'
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              {paymentData?.pixQrCode ? (
                <img 
                  src={paymentData.pixQrCode} 
                  alt="QR Code PIX" 
                  className="w-48 h-48 rounded-lg bg-white p-2"
                />
              ) : (
                <div className="w-48 h-48 rounded-lg bg-secondary flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
              
              <p className="text-sm text-muted-foreground text-center">
                Escaneie o QR Code ou copie o código PIX abaixo
              </p>
            </div>

            {/* Payment Status Indicator */}
            <div className={`p-4 rounded-lg border ${
              paymentStatus === 'paid' 
                ? 'bg-green-500/10 border-green-500/30' 
                : paymentStatus === 'failed'
                ? 'bg-destructive/10 border-destructive/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}>
              <div className="flex items-center justify-center gap-3">
                {paymentStatus === 'pending' && (
                  <>
                    <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
                    <div className="text-center">
                      <p className="font-medium text-yellow-500">Aguardando pagamento</p>
                      <p className="text-xs text-muted-foreground">
                        {isPolling ? 'Verificando status...' : 'Escaneie o QR Code para pagar'}
                      </p>
                    </div>
                  </>
                )}
                {paymentStatus === 'paid' && (
                  <>
                    <PartyPopper className="h-5 w-5 text-green-500" />
                    <div className="text-center">
                      <p className="font-medium text-green-500">Pagamento confirmado!</p>
                      <p className="text-xs text-muted-foreground">
                        Seus Robux serão enviados em instantes
                      </p>
                    </div>
                  </>
                )}
                {paymentStatus === 'failed' && (
                  <>
                    <XCircle className="h-5 w-5 text-destructive" />
                    <div className="text-center">
                      <p className="font-medium text-destructive">Pagamento expirado</p>
                      <p className="text-xs text-muted-foreground">
                        Tente novamente com um novo PIX
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {paymentStatus === 'pending' && paymentData?.pixCode && (
              <div className="relative">
                <div className="p-3 bg-secondary rounded-lg text-xs break-all font-mono">
                  {paymentData.pixCode.slice(0, 80)}...
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            {paymentStatus === 'pending' && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-center">
                  Após o pagamento, os Robux serão enviados para o usuário{' '}
                  <span className="font-bold text-primary">{clientData.robloxUser}</span>{' '}
                  em até 5 minutos.
                </p>
              </div>
            )}

            {paymentStatus === 'paid' && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-sm text-center">
                  <span className="font-bold text-green-500">{clientData.robloxUser}</span>{' '}
                  receberá os Robux automaticamente. Obrigado pela compra!
                </p>
              </div>
            )}

            <Button 
              onClick={paymentStatus === 'failed' ? () => setStep('form') : handleClose} 
              variant={paymentStatus === 'failed' ? 'default' : 'outline'} 
              className="w-full"
            >
              {paymentStatus === 'failed' ? 'Tentar Novamente' : 'Fechar'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
