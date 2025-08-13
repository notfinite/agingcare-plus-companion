import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Accessibility,
  MessageSquare
} from 'lucide-react';

interface VoiceCommand {
  command: string;
  action: string;
  confidence: number;
}

export const VoiceAccessibility = () => {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [lastTranscript, setLastTranscript] = useState('');
  const [recognizedCommands, setRecognizedCommands] = useState<VoiceCommand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    initializeVoiceRecognition();
    speak("Voice accessibility is now active. You can control the app with your voice. Say 'help' to hear available commands.");
    
    return () => {
      cleanup();
    };
  }, []);

  const initializeVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        
        if (transcript) {
          setLastTranscript(transcript);
          processVoiceCommand(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'network') {
          toast({
            title: "Connection Error",
            description: "Voice recognition is having trouble connecting. Please check your internet connection.",
            variant: "destructive"
          });
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart recognition if it stops unexpectedly
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      };
    } else {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition. Please use a modern browser for voice accessibility features.",
        variant: "destructive"
      });
    }
  };

  const processVoiceCommand = async (transcript: string) => {
    const command = transcript.toLowerCase().trim();
    setIsProcessing(true);

    // Define voice commands
    const commands = {
      'help': () => {
        speak("Available voice commands: Navigate home, go to compassionate care, open health, schedule appointment, emergency, show medications, call doctor, or speak naturally to ask questions.");
      },
      'navigate home': () => {
        window.location.href = '/dashboard';
        speak("Navigating to home dashboard");
      },
      'go to dashboard': () => {
        window.location.href = '/dashboard';
        speak("Opening dashboard");
      },
      'compassionate care': () => {
        window.location.href = '/compassionate-care';
        speak("Opening compassionate care with AI companion");
      },
      'open health': () => {
        window.location.href = '/health';
        speak("Opening health dashboard");
      },
      'schedule appointment': () => {
        window.location.href = '/appointments';
        speak("Opening appointment scheduler");
      },
      'emergency': () => {
        speak("Emergency mode activated. Looking for emergency button.");
        // Find and trigger emergency button
        const emergencyBtn = document.querySelector('[data-emergency]') as HTMLButtonElement;
        if (emergencyBtn) {
          emergencyBtn.click();
        } else {
          speak("Emergency contacts: Please call 911 for immediate help, or contact your healthcare provider.");
        }
      },
      'show medications': () => {
        speak("Displaying your medication list");
        window.location.href = '/health';
      },
      'call doctor': () => {
        speak("Initiating video call with your healthcare provider");
        window.location.href = '/telehealth';
      },
      'read messages': () => {
        speak("Reading your latest health messages. Opening community section.");
        window.location.href = '/community';
      },
      'voice louder': () => {
        setVoiceSpeed(prev => Math.min(prev + 0.2, 2));
        speak("Speaking louder now");
      },
      'voice quieter': () => {
        setVoiceSpeed(prev => Math.max(prev - 0.2, 0.5));
        speak("Speaking more quietly now");
      },
      'speak faster': () => {
        setVoiceSpeed(prev => Math.min(prev + 0.2, 2));
        speak("Speaking faster now");
      },
      'speak slower': () => {
        setVoiceSpeed(prev => Math.max(prev - 0.2, 0.5));
        speak("Speaking slower now");
      },
      'stop talking': () => {
        speechSynthesis.cancel();
        speak("Voice stopped");
      },
      'repeat that': () => {
        const lastMessage = recognizedCommands[recognizedCommands.length - 1];
        if (lastMessage) {
          speak(`I last heard: ${lastMessage.command}`);
        } else {
          speak("I don't have anything to repeat");
        }
      }
    };

    // Check for exact command matches first
    const exactMatch = Object.keys(commands).find(cmd => command.includes(cmd));
    if (exactMatch) {
      commands[exactMatch as keyof typeof commands]();
      setRecognizedCommands(prev => [...prev, {
        command: exactMatch,
        action: 'Executed',
        confidence: 0.9
      }].slice(-5));
    } else {
      // Handle natural language queries
      await handleNaturalLanguageQuery(transcript);
    }

    setIsProcessing(false);
  };

  const handleNaturalLanguageQuery = async (query: string) => {
    try {
      speak("Let me help you with that question.");
      
      // Use our compassionate AI instead of the generic health assistant
      const { data } = await supabase.functions.invoke('compassionate-ai', {
        body: {
          message: query,
          conversationHistory: [],
          userContext: {
            type: 'voice_query',
            accessibility_mode: true,
            voice_response_required: true,
            timestamp: new Date().toISOString(),
            source: 'voice_accessibility'
          }
        }
      });

      if (data?.response) {
        speak(data.response);
        setRecognizedCommands(prev => [...prev, {
          command: query,
          action: 'AI Response',
          confidence: 0.8
        }].slice(-5));
      } else {
        speak("I'm here to help, but I'm having trouble understanding that request. Could you try rephrasing it?");
      }
    } catch (error) {
      speak("I'm sorry, I'm having trouble processing that request right now. Please try again or use the visual interface.");
      console.error('Natural language processing error:', error);
    }
  };

  const speak = async (text: string) => {
    if (!isVoiceEnabled) return;

    try {
      // Use Supabase edge function for high-quality TTS
      const { data } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text, 
          voice: 'alloy',
          speed: voiceSpeed 
        }
      });
      
      if (data?.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.playbackRate = voiceSpeed;
        audio.play();
      }
    } catch (error) {
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSpeed;
      utterance.volume = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      speak("Voice recognition stopped");
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        speak("Voice recognition started. I'm listening.");
      }
    }
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  return (
    <Card className="border-compassion-gentle bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-compassion-primary">
          <Accessibility className="h-5 w-5" />
          Voice Accessibility Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Control Status */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="font-medium">
              {isListening ? 'Listening for commands...' : 'Voice control inactive'}
            </span>
          </div>
          <Badge variant={isListening ? 'default' : 'secondary'}>
            {isListening ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Main Controls */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={toggleListening}
            variant={isListening ? 'destructive' : 'default'}
            className="h-16 text-lg"
          >
            {isListening ? <MicOff className="h-6 w-6 mr-2" /> : <Mic className="h-6 w-6 mr-2" />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
          
          <Button
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            variant={isVoiceEnabled ? 'default' : 'outline'}
            className="h-16 text-lg"
          >
            {isVoiceEnabled ? <Volume2 className="h-6 w-6 mr-2" /> : <VolumeX className="h-6 w-6 mr-2" />}
            {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
          </Button>
        </div>

        {/* Voice Speed Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Voice Speed</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceSpeed(prev => Math.max(prev - 0.2, 0.5))}
            >
              Slower
            </Button>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-compassion-primary h-2 rounded-full transition-all"
                style={{ width: `${((voiceSpeed - 0.5) / 1.5) * 100}%` }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceSpeed(prev => Math.min(prev + 0.2, 2))}
            >
              Faster
            </Button>
            <span className="text-sm min-w-[3rem]">{voiceSpeed.toFixed(1)}x</span>
          </div>
        </div>

        {/* Last Transcript */}
        {lastTranscript && (
          <div className="p-3 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-medium mb-1">Last heard:</h4>
            <p className="text-sm text-gray-700">"{lastTranscript}"</p>
          </div>
        )}

        {/* Recent Commands */}
        {recognizedCommands.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Commands:</h4>
            <div className="space-y-1">
              {recognizedCommands.map((cmd, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span className="truncate flex-1">"{cmd.command}"</span>
                  <Badge variant="outline" className="ml-2">
                    {cmd.action}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Commands */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Try saying:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-blue-50 rounded border">
              <MessageSquare className="h-3 w-3 mb-1" />
              "Help" - List commands
            </div>
            <div className="p-2 bg-green-50 rounded border">
              <Play className="h-3 w-3 mb-1" />
              "Navigate home"
            </div>
            <div className="p-2 bg-purple-50 rounded border">
              <Settings className="h-3 w-3 mb-1" />
              "Schedule appointment"
            </div>
            <div className="p-2 bg-orange-50 rounded border">
              <Accessibility className="h-3 w-3 mb-1" />
              "Call doctor"
            </div>
          </div>
        </div>

        {/* Test Voice */}
        <Button
          variant="outline"
          onClick={() => speak("Voice accessibility is working perfectly. How can I help you today?")}
          className="w-full"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Test Voice Output
        </Button>
      </CardContent>
    </Card>
  );
};