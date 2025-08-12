import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userAction, context = {}, userRole = 'patient' } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Carbon footprint calculation database
    const carbonData = {
      diet: {
        beef: { co2_per_kg: 60, water_liters_per_kg: 15400 },
        pork: { co2_per_kg: 12.1, water_liters_per_kg: 5988 },
        chicken: { co2_per_kg: 6.9, water_liters_per_kg: 4325 },
        fish: { co2_per_kg: 6.1, water_liters_per_kg: 3500 },
        vegetables: { co2_per_kg: 2.0, water_liters_per_kg: 322 },
        fruits: { co2_per_kg: 1.1, water_liters_per_kg: 962 },
        grains: { co2_per_kg: 2.7, water_liters_per_kg: 1644 }
      },
      transportation: {
        car_gasoline: { co2_per_mile: 0.89 },
        car_electric: { co2_per_mile: 0.46 },
        bus: { co2_per_mile: 0.33 },
        walking: { co2_per_mile: 0 },
        bike: { co2_per_mile: 0 }
      },
      healthcare: {
        telehealth: { co2_reduction_vs_inperson: 0.7 },
        digital_prescriptions: { co2_reduction_vs_paper: 0.1 },
        reusable_medical_devices: { co2_reduction_vs_disposable: 0.4 }
      }
    };

    const systemPrompt = `You are EcoHealth AI, a sustainability advisor for healthcare. You provide:

CORE CAPABILITIES:
- Calculate carbon footprints for health-related activities
- Recommend eco-friendly alternatives with specific impact data
- Provide actionable interventions based on user data
- Give personalized advice for ${userRole}s

CARBON CALCULATION DATA:
${JSON.stringify(carbonData, null, 2)}

RESPONSE FORMAT:
Always provide:
1. Carbon Impact Analysis (use actual data from above)
2. Specific Recommendations (with quantified benefits)
3. Easy Action Steps
4. Environmental & Health Benefits

USER CONTEXT: ${JSON.stringify(context)}

Be precise with calculations and focus on practical, achievable changes.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userAction }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const recommendation = data.choices[0].message.content;

    // Calculate specific carbon savings if action involves known items
    let carbonCalculation = null;
    if (userAction.toLowerCase().includes('beef') || userAction.toLowerCase().includes('meat')) {
      carbonCalculation = {
        current_choice: 'beef',
        current_co2_kg: carbonData.diet.beef.co2_per_kg,
        alternative: 'vegetables',
        alternative_co2_kg: carbonData.diet.vegetables.co2_per_kg,
        savings_per_kg: carbonData.diet.beef.co2_per_kg - carbonData.diet.vegetables.co2_per_kg,
        water_savings_liters: carbonData.diet.beef.water_liters_per_kg - carbonData.diet.vegetables.water_liters_per_kg
      };
    }

    return new Response(JSON.stringify({ 
      recommendation,
      carbonCalculation,
      userRole,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Sustainability AI Advisor:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      recommendation: "I'm having trouble providing sustainability advice right now. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});