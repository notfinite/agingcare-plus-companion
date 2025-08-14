import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AIHealthAssistantProps {
  userRole?: 'patient' | 'caregiver' | 'provider';
  context?: {
    vitals?: {
      bloodPressure: string;
      heartRate: string;
    };
    medications?: string[];
  };
}

export const AIHealthAssistant: React.FC<AIHealthAssistantProps> = ({ 
  userRole = 'patient',
  context = {}
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm your AI health assistant. How can I help you today?`,
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    console.log('AIHealthAssistant: Starting sendMessage with:', messageText);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('AIHealthAssistant: About to call edge function with:', { messageText, userRole, context });
      setDebugInfo('Calling AI edge function...');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
      );
      
      const functionCall = supabase.functions.invoke('ai-health-assistant', {
        body: {
          message: messageText,
          userRole,
          context
        }
      });

      const { data, error } = await Promise.race([functionCall, timeoutPromise]) as any;

      console.log('AIHealthAssistant: Function response:', { data, error });

      if (error) {
        console.error('AIHealthAssistant: Function error:', error);
        setDebugInfo(`Function error: ${error.message}`);
        throw error;
      }

      if (!data) {
        setDebugInfo('No data returned from function');
        throw new Error('No data received from AI assistant');
      }

      if (!data.response) {
        setDebugInfo(`Invalid response format: ${JSON.stringify(data)}`);
        throw new Error('Invalid response format from AI assistant');
      }

      setDebugInfo('Success! AI responded');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Convert response to speech if audio is enabled (skip for now due to function errors)
      // if (audioEnabled) {
      //   await playTextAsAudio(data.response);
      // }

    } catch (error) {
      setDebugInfo(`Error: ${error.message || 'Failed to get AI response'}`);
      toast({
        title: "AI Assistant Error",
        description: error.message || "Failed to get response from AI assistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Clear debug info after 5 seconds
      setTimeout(() => setDebugInfo(''), 5000);
    }
  };

  const playTextAsAudio = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' }
      });

      if (error) throw error;

      const audioBlob = new Blob([
        Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
      ], { type: 'audio/mp3' });

      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }

    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const startRecording = async () => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this browser');
      }

      console.log('Attempting to access microphone...');
      
      // Request microphone permission with minimal constraints
      let stream;
      try {
        // Try with basic audio constraints first
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        });
        console.log('Microphone access granted');
      } catch (error: any) {
        console.error('getUserMedia error:', error);
        
        // Try fallback with no constraints
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('Microphone access granted with fallback');
        } catch (fallbackError: any) {
          console.error('Fallback getUserMedia error:', fallbackError);
          
          // Handle specific error types with more helpful messages
          if (fallbackError.name === 'NotAllowedError') {
            throw new Error('Please click "Allow" when your browser asks for microphone permission.');
          } else if (fallbackError.name === 'NotFoundError') {
            throw new Error('No microphone detected. Please check that your microphone is connected and enabled in your system settings.');
          } else if (fallbackError.name === 'NotReadableError') {
            throw new Error('Microphone is busy. Please close other apps using your microphone and try again.');
          } else if (fallbackError.name === 'OverconstrainedError') {
            throw new Error('Your microphone doesn\'t support the required settings.');
          } else {
            throw new Error(`Microphone error: ${fallbackError.message}. Please check your browser and system microphone settings.`);
          }
        }
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording",
        description: "Speak now...",
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      let errorMessage = "Could not access microphone";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Microphone access denied. Please allow microphone access in your browser settings and try again.";
      } else if (error.name === 'NotFoundError' || error.message.includes('No audio input devices')) {
        errorMessage = "No microphone found. Please connect a microphone and refresh the page.";
      } else if (error.name === 'NotSupportedError' || error.message.includes('MediaDevices API not supported')) {
        errorMessage = "Audio recording not supported on this device or browser.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Microphone is being used by another application. Please close other apps and try again.";
      }
      
      toast({
        title: "Microphone Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    setIsLoading(true);
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });

        if (error) throw error;

        if (data.text) {
          await sendMessage(data.text);
        } else {
          toast({
            title: "No speech detected",
            description: "Please try speaking again",
          });
        }
      };

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error",
        description: "Failed to process voice input",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          AI Health Assistant
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
        {debugInfo && (
          <div className="text-xs text-muted-foreground mt-1 p-2 bg-muted rounded">
            Debug: {debugInfo}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0 p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="p-2 bg-primary/10 rounded-full">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.role === 'user' && (
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Bot className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm animate-pulse">Analyzing your health question... 🔍</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2 flex-shrink-0">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message or use voice..."
            disabled={isLoading}
            className="flex-1"
          />
          
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            disabled={isLoading}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      
      <audio ref={audioRef} style={{ display: 'none' }} />
    </Card>
  );
};