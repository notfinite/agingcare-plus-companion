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
    const { message, userRole = 'patient', context = {} } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    console.log('Gemini API Key exists:', !!GEMINI_API_KEY);
    
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Create personalized system prompt based on user role
    const rolePrompts = {
      patient: `You are HealthBuddy, a caring AI health assistant for aging adults. You provide:
        - Gentle medication reminders and health advice
        - Easy-to-understand explanations of health information
        - Encouragement for healthy habits
        - Emergency guidance when needed
        - Warm, patient, and supportive responses
        Always speak in simple, clear language and show empathy.`,
      
      caregiver: `You are CarePartner, an AI assistant for family caregivers of aging adults. You provide:
        - Practical caregiving advice and tips
        - Information about managing care recipients' conditions
        - Support for caregiver stress and burnout
        - Coordination help for medical appointments
        - Resources for family communication
        Be professional yet understanding of caregiver challenges.`,
      
      provider: `You are MedAssist, an AI clinical assistant for healthcare providers. You provide:
        - Clinical decision support and evidence-based insights
        - Patient population health analytics
        - Medication interaction warnings
        - Care coordination recommendations
        - Documentation assistance
        Be precise, clinical, and evidence-based in responses.`
    };

    const systemPrompt = rolePrompts[userRole as keyof typeof rolePrompts] || rolePrompts.patient;

    // Add context about user's current health data if provided
    const contextInfo = context.vitals ? 
      `\n\nCurrent user context: Blood Pressure: ${context.vitals.bloodPressure}, Heart Rate: ${context.vitals.heartRate}, Recent medications: ${context.medications || 'None specified'}.` : '';

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt + contextInfo}\n\nUser: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Response:', response.status, response.statusText);
      console.error('Gemini API Error Body:', errorText);
      throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const assistantResponse = data.candidates[0].content.parts[0].text;

    console.log('AI Health Assistant Response:', assistantResponse);

    return new Response(JSON.stringify({ 
      response: assistantResponse,
      userRole,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI Health Assistant:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, I'm having trouble right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});