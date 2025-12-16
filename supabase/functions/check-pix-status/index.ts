import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StatusRequest {
  transactionId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionId }: StatusRequest = await req.json();

    const publicKey = Deno.env.get('SIGILO_PAY_PUBLIC_KEY');
    const secretKey = Deno.env.get('SIGILO_PAY_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!publicKey || !secretKey) {
      throw new Error('SigiloPay credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Checking payment status for transaction:', transactionId);

    const response = await fetch(`https://app.sigilopay.com.br/api/v1/gateway/pix/transaction/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-public-key': publicKey,
        'x-secret-key': secretKey,
      },
    });

    const data = await response.json();

    console.log('SigiloPay status response:', JSON.stringify(data));

    if (!response.ok) {
      throw new Error(data.message || 'Failed to check payment status');
    }

    // Map SigiloPay status to our status
    let status: 'pending' | 'paid' | 'failed' = 'pending';
    if (data.status === 'PAID' || data.status === 'paid' || data.status === 'completed') {
      status = 'paid';
    } else if (data.status === 'EXPIRED' || data.status === 'expired' || data.status === 'CANCELLED' || data.status === 'cancelled') {
      status = 'failed';
    }

    // Update order status in database
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('transaction_id', transactionId);

    if (updateError) {
      console.error('Error updating order status:', updateError);
    }

    return new Response(JSON.stringify({
      success: true,
      status,
      rawStatus: data.status,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error checking payment status:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
