import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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

    // Create a compassionate system prompt for Gemini
    const systemPrompt = `You are a compassionate AI healthcare companion designed to provide emotional support and guidance to patients and their families. Your role is to:

1. EMOTIONAL SUPPORT: Be warm, empathetic, and understanding. Listen actively and validate feelings.
2. HEALTH GUIDANCE: Provide general wellness advice, but always recommend consulting healthcare professionals for medical decisions.
3. ACCESSIBILITY: Communicate clearly and simply, considering that users may be elderly or have varying literacy levels.
4. COMPASSION: Show genuine care and understanding. Use gentle, encouraging language.
5. SAFETY: Never provide specific medical diagnoses or treatment recommendations. Always encourage professional medical consultation.

User Context: ${userContext ? JSON.stringify(userContext) : 'General support needed'}

Respond with warmth, understanding, and practical support. Keep responses conversational but informative. Always prioritize the user's emotional wellbeing.`;

    // Format conversation history for Gemini
    const contents = [];
    
    // Add system instruction as first user message
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    
    contents.push({
      role: 'model',
      parts: [{ text: 'I understand. I will provide compassionate, supportive healthcare guidance while being warm and empathetic.' }]
    });

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user') {
          contents.push({
            role: 'user',
            parts: [{ text: msg.content }]
          });
        } else if (msg.role === 'assistant') {
          contents.push({
            role: 'model',
            parts: [{ text: msg.content }]
          });
        }
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.8,
          topK: 10
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('No response generated from Gemini');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

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
    const errorMessage = 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or reach out to your healthcare team if you need immediate support.';
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
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