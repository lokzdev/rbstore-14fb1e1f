import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number;
  productName: string;
  productId: string;
  quantity: number;
  robuxAmount: number;
  client: {
    name: string;
    email: string;
    phone: string;
    document: string;
    robloxUser: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, productName, productId, quantity, robuxAmount, client }: PaymentRequest = await req.json();

    const publicKey = Deno.env.get('SIGILO_PAY_PUBLIC_KEY');
    const secretKey = Deno.env.get('SIGILO_PAY_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!publicKey || !secretKey) {
      throw new Error('SigiloPay credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const identifier = `robux_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const payload = {
      identifier,
      amount,
      client: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        document: client.document,
      },
      products: [
        {
          id: productId,
          name: productName,
          quantity,
          price: amount / quantity,
        },
      ],
      metadata: {
        source: 'robux-store',
        productId,
        quantity: quantity.toString(),
        robloxUser: client.robloxUser,
      },
    };

    console.log('Creating PIX payment with payload:', JSON.stringify(payload));

    const response = await fetch('https://app.sigilopay.com.br/api/v1/gateway/pix/receive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-public-key': publicKey,
        'x-secret-key': secretKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('SigiloPay response:', JSON.stringify(data));

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create PIX payment');
    }

    // Save order to database
    const { error: insertError } = await supabase
      .from('orders')
      .insert({
        transaction_id: data.transactionId,
        customer_name: client.name,
        roblox_username: client.robloxUser,
        email: client.email,
        robux_amount: robuxAmount,
        price_brl: amount,
        status: 'pending',
      });

    if (insertError) {
      console.error('Error saving order:', insertError);
    }

    const base64Image = data.pix?.base64 || data.pix?.image;
    const pixQrCode = base64Image ? `data:image/png;base64,${base64Image}` : null;

    return new Response(JSON.stringify({
      success: true,
      transactionId: data.transactionId,
      status: data.status,
      pixCode: data.pix?.code,
      pixQrCode,
      orderUrl: data.order?.url,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating PIX payment:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
