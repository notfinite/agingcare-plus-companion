import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, userContext } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Create a compassionate system prompt
    const systemPrompt = `You are a compassionate AI healthcare companion designed to provide emotional support and guidance to patients and their families. Your role is to:

1. EMOTIONAL SUPPORT: Be warm, empathetic, and understanding. Listen actively and validate feelings.
2. HEALTH GUIDANCE: Provide general wellness advice, but always recommend consulting healthcare professionals for medical decisions.
3. ACCESSIBILITY: Communicate clearly and simply, considering that users may be elderly or have varying literacy levels.
4. COMPASSION: Show genuine care and understanding. Use gentle, encouraging language.
5. SAFETY: Never provide specific medical diagnoses or treatment recommendations. Always encourage professional medical consultation.

User Context: ${userContext ? JSON.stringify(userContext) : 'General support needed'}

Respond with warmth, understanding, and practical support. Keep responses conversational but informative. Always prioritize the user's emotional wellbeing.`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Simple sentiment analysis based on keywords
    const sentimentScore = analyzeSentiment(message);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      sentiment: sentimentScore,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in compassionate-ai function:', error);
    return new Response(JSON.stringify({ 
      error: 'I apologize, but I'm having trouble connecting right now. Please try again in a moment, or reach out to your healthcare team if you need immediate support.',
      fallbackResponse: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeSentiment(text: string): { score: number; keywords: string[] } {
  const positiveKeywords = ['happy', 'good', 'great', 'better', 'improved', 'grateful', 'thankful', 'optimistic', 'hopeful', 'wonderful'];
  const negativeKeywords = ['sad', 'worried', 'anxious', 'depressed', 'pain', 'hurt', 'scared', 'afraid', 'terrible', 'awful', 'worse'];
  const neutralKeywords = ['okay', 'fine', 'normal', 'same', 'usual'];

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  const foundKeywords: string[] = [];

  words.forEach(word => {
    if (positiveKeywords.includes(word)) {
      positiveCount++;
      foundKeywords.push(word);
    } else if (negativeKeywords.includes(word)) {
      negativeCount++;
      foundKeywords.push(word);
    } else if (neutralKeywords.includes(word)) {
      neutralCount++;
      foundKeywords.push(word);
    }
  });

  // Calculate sentiment score (-1 to 1)
  const totalSentimentWords = positiveCount + negativeCount + neutralCount;
  let score = 0;
  
  if (totalSentimentWords > 0) {
    score = (positiveCount - negativeCount) / totalSentimentWords;
  }

  return {
    score: Math.max(-1, Math.min(1, score)),
    keywords: foundKeywords
  };
}