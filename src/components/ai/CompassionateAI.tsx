import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Phone,
  Shield,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  User,
  Bot
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion_detected?: string;
  crisis_flag?: boolean;
}

interface EmotionalState {
  primary_emotion: string;
  confidence: number;
  sentiment_score: number;
  needs_support: boolean;
}

export const CompassionateAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with a warm welcome message
    setMessages([{
      id: '1',
      content: "Hi there! I'm here to listen and support you. How are you feeling today? Remember, it's okay to not be okay - I'm here for you. 💙",
      sender: 'ai',
      timestamp: new Date()
    }]);

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "I couldn't hear you clearly. Would you like to try typing instead?",
          variant: "destructive"
        });
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const analyzeEmotion = (text: string): EmotionalState => {
    // Simple emotion detection (in production, use proper NLP)
    const negativeWords = ['sad', 'depressed', 'anxious', 'worried', 'scared', 'lonely', 'hopeless', 'hurt', 'pain', 'dying', 'suicide'];
    const positiveWords = ['happy', 'good', 'better', 'excited', 'grateful', 'thankful', 'hopeful', 'proud'];
    const crisisWords = ['suicide', 'kill myself', 'end it all', 'dying', 'worthless', 'can\'t go on'];
    
    const lowerText = text.toLowerCase();
    
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasCrisis = crisisWords.some(word => lowerText.includes(word));
    
    let primary_emotion = 'neutral';
    let sentiment_score = 0;
    let needs_support = false;
    
    if (hasCrisis) {
      primary_emotion = 'crisis';
      sentiment_score = -1;
      needs_support = true;
      setShowCrisisSupport(true);
    } else if (hasNegative) {
      primary_emotion = 'distressed';
      sentiment_score = -0.6;
      needs_support = true;
    } else if (hasPositive) {
      primary_emotion = 'positive';
      sentiment_score = 0.7;
    }
    
    return {
      primary_emotion,
      confidence: 0.8,
      sentiment_score,
      needs_support
    };
  };

  const generateCompassionateResponse = (userMessage: string, emotion: EmotionalState): string => {
    if (emotion.primary_emotion === 'crisis') {
      return "I'm really concerned about you right now. Your feelings are valid, and you're not alone. Please reach out to someone who can help immediately. Would you like me to connect you with a crisis counselor? In the US, you can call 988 for the Suicide & Crisis Lifeline. Your life has value, and there are people who want to help. 💙";
    }
    
    if (emotion.needs_support) {
      const supportiveResponses = [
        "I hear you, and I want you to know that what you're feeling is completely valid. It takes courage to share your feelings. What's one small thing that might help you feel a little better right now?",
        "Thank you for trusting me with how you're feeling. You're not alone in this. Sometimes talking through our feelings can help - would you like to tell me more about what's been on your mind?",
        "I can sense you're going through a difficult time. Your feelings matter, and it's okay to not be okay. What kind of support feels most helpful to you right now?"
      ];
      return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
    }
    
    if (emotion.primary_emotion === 'positive') {
      return "It's wonderful to hear some positivity in your message! Those good moments, even small ones, are so important. What's been bringing you joy or comfort lately?";
    }
    
    // Default empathetic response
    return "Thank you for sharing with me. I'm here to listen and support you. How can I best help you today?";
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Analyze emotion
    const emotion = analyzeEmotion(currentMessage);
    setEmotionalState(emotion);
    
    setCurrentMessage('');
    setIsTyping(true);

    
    // Get immediate fallback response
    const fallbackResponse = generateCompassionateResponse(currentMessage, emotion);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: fallbackResponse,
      sender: 'ai',
      timestamp: new Date(),
      emotion_detected: emotion.primary_emotion,
      crisis_flag: emotion.primary_emotion === 'crisis'
    };

    setMessages(prev => [...prev, aiMessage]);

    // Text-to-speech for AI responses if enabled
    if (isAudioEnabled) {
      speak(fallbackResponse);
    }

    // Now get enhanced response from our compassionate AI edge function
    try {
      console.log('🚀 Sending message to compassionate AI:', currentMessage);
      console.log('📊 Supabase client exists:', !!supabase);
      console.log('🔧 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🔧 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
      console.log('🔧 Current messages for context:', messages.length);
      
      // Test supabase connection first
      const { data: connectionTest, error: connectionError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      console.log('🔗 Supabase connection test:', { connectionTest, connectionError });
      
      const requestBody = {
        message: currentMessage,
        conversationHistory: messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        userContext: {
          emotionalState: emotion,
          timestamp: new Date().toISOString(),
          source: 'compassionate_dashboard'
        }
      };
      
      console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));
      
      const { data, error } = await supabase.functions.invoke('compassionate-ai', {
        body: requestBody
      });

      console.log('📨 Raw AI Response:', data);
      console.log('❌ Raw Error:', error);

      if (error) {
        console.error('Edge function error:', error);
        console.error('Edge function error details:', JSON.stringify(error, null, 2));
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (data?.response) {
        // Replace the fallback response with the enhanced AI response
        const enhancedResponse: Message = {
          id: (Date.now() + 2).toString(),
          content: data.response,
          sender: 'ai',
          timestamp: new Date(),
          emotion_detected: emotion.primary_emotion,
          crisis_flag: emotion.primary_emotion === 'crisis'
        };
        
        // Replace the last AI message with the enhanced one
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = enhancedResponse;
          return newMessages;
        });
        
        if (isAudioEnabled) {
          speak(data.response);
        }

        toast({
          title: emotion.needs_support ? "💙 You're not alone" : "Thank you for sharing",
          description: "I'm here to support you with understanding and care.",
        });
      } else if (data?.error) {
        console.error('AI service error:', data.error);
        console.error('Debug info:', data.debugInfo);
        toast({
          title: "AI Service Issue",
          description: `Debug: ${data.debugInfo || 'Unknown error'}`,
          variant: "destructive"
        });
      } else {
        console.error('Unexpected response format:', data);
        toast({
          title: "Unexpected Response",
          description: "The AI service returned an unexpected format.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      toast({
        title: "I'm still here for you",
        description: `Connection issue: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const speak = async (text: string) => {
    try {
      const { data } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' }
      });
      
      if (data?.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      toast({
        title: "Voice Input Not Available",
        description: "Your browser doesn't support voice input. You can still type your message.",
      });
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'positive': return <Smile className="h-4 w-4 text-green-500" />;
      case 'distressed': return <Frown className="h-4 w-4 text-red-500" />;
      case 'crisis': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Meh className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-compassion-gentle bg-gradient-to-br from-white to-compassion-gentle">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-compassion-primary">
              <Heart className="h-5 w-5 text-compassion-heart" />
              Compassionate AI Companion
            </CardTitle>
            <div className="flex items-center gap-2">
              {emotionalState && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {getEmotionIcon(emotionalState.primary_emotion)}
                  {emotionalState.primary_emotion}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Crisis Support Banner */}
          {showCrisisSupport && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">Immediate Support Available</h4>
                  <p className="text-sm text-red-700 mt-1">
                    If you're in crisis, please reach out for immediate help:
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>US Crisis Lifeline:</strong> 988</p>
                    <p><strong>Emergency:</strong> 911</p>
                    <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                  </div>
                  <Button size="sm" className="mt-2" variant="destructive">
                    <Phone className="h-3 w-3 mr-1" />
                    Connect to Crisis Counselor
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="h-96 overflow-y-auto space-y-3 p-4 bg-white rounded-lg border">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-compassion-primary text-white'
                      : 'bg-compassion-gentle border border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'ai' && <Bot className="h-4 w-4 mt-0.5 text-compassion-primary" />}
                    {message.sender === 'user' && <User className="h-4 w-4 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  {message.crisis_flag && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <Badge variant="destructive" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Crisis Support Activated
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-compassion-gentle border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-compassion-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-compassion-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-compassion-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-compassion-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Share what's on your mind... I'm here to listen 💙"
                className="resize-none border-gray-200 focus:border-compassion-primary"
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={startListening}
                disabled={isListening}
                className="border-gray-200 hover:bg-compassion-gentle"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                onClick={sendMessage}
                disabled={!currentMessage.trim()}
                size="sm"
                className="bg-compassion-primary hover:bg-compassion-secondary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Support Options */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMessage("I'm feeling anxious")}
              className="text-xs border-gray-200 hover:bg-compassion-gentle"
            >
              I'm feeling anxious
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMessage("I need someone to talk to")}
              className="text-xs border-gray-200 hover:bg-compassion-gentle"
            >
              I need someone to talk to
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMessage("I'm having a hard day")}
              className="text-xs border-gray-200 hover:bg-compassion-gentle"
            >
              I'm having a hard day
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};