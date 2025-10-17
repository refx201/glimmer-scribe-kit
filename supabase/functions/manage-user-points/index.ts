import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { userId, pointsChange, reason } = await req.json()

    if (!userId || pointsChange === undefined) {
      throw new Error('Missing required fields')
    }

    // Get current points using service role
    const { data: currentPointsData } = await supabaseAdmin
      .from('user_points')
      .select('points')
      .eq('user_id', userId)
      .maybeSingle()

    const currentAmount = currentPointsData?.points || 0
    const newAmount = Math.max(0, currentAmount + pointsChange)

    // Upsert points using service role
    const { error: pointsError } = await supabaseAdmin
      .from('user_points')
      .upsert({
        user_id: userId,
        points: newAmount,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (pointsError) {
      console.error('Points update error:', pointsError)
      throw pointsError
    }

    // Add to history
    const { error: historyError } = await supabaseAdmin
      .from('user_points_history')
      .insert({
        user_id: userId,
        points_change: pointsChange,
        reason: reason || (pointsChange > 0 ? 'نقاط مضافة' : 'نقاط مخصومة'),
        admin_id: null
      })

    if (historyError) {
      console.warn('History error:', historyError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        newPoints: newAmount 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})