import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Send, Phone, Video, MoreVertical, Paperclip, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  message_type: 'text' | 'image' | 'file' | 'voice' | 'emergency';
  is_urgent: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  type: string;
  title: string;
  participants: Array<{
    user_id: string;
    name: string;
    role: string;
  }>;
}

export const RealTimeChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
    
    // Subscribe to real-time message updates
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new.conversation_id === activeConversation) {
            fetchMessages(activeConversation);
          }
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) return;

      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations:conversation_id (
            id, type, title, created_at
          )
        `)
        .eq('user_id', userProfile.id);

      if (error) throw error;

      const conversationData = data?.map(item => ({
        ...item.conversations,
        participants: []
      })).filter(Boolean) || [];
      setConversations(conversationData as Conversation[]);
      
      if (conversationData.length > 0 && !activeConversation) {
        setActiveConversation(conversationData[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, content, message_type, is_urgent, created_at,
          sender:sender_id (
            id, full_name, role
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data?.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender?.id || '',
        sender_name: msg.sender?.full_name || 'Unknown',
        sender_role: msg.sender?.role || 'user',
        message_type: msg.message_type as 'text' | 'image' | 'file' | 'voice' | 'emergency',
        is_urgent: msg.is_urgent,
        created_at: msg.created_at
      })) || [];

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) return;

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversation,
          sender_id: userProfile.id,
          content: newMessage,
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(activeConversation);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const createEmergencyConversation = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) return;

      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
          type: 'emergency',
          title: 'Emergency Alert - Immediate Response Required'
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversation.id,
          user_id: userProfile.id,
          role: 'patient'
        });

      // Send emergency message
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: userProfile.id,
          content: 'EMERGENCY: Immediate assistance required',
          message_type: 'emergency',
          is_urgent: true
        });

      toast({
        title: "Emergency Alert Sent",
        description: "Your emergency alert has been sent to your care team",
        variant: "default"
      });

      fetchConversations();
    } catch (error) {
      console.error('Error creating emergency conversation:', error);
      toast({
        title: "Error",
        description: "Failed to send emergency alert",
        variant: "destructive"
      });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'provider': return 'bg-blue-500';
      case 'caregiver': return 'bg-green-500';
      case 'patient': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] space-x-2">
        <div className="animate-spin h-5 w-5 border-2 border-primary/20 border-t-primary rounded-full"></div>
        <span>Connecting you with your care team...</span>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-muted/10">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Messages</h3>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={createEmergencyConversation}
            >
              Emergency
            </Button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[500px]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-muted/20 ${
                activeConversation === conversation.id ? 'bg-muted/30' : ''
              }`}
              onClick={() => {
                setActiveConversation(conversation.id);
                fetchMessages(conversation.id);
              }}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">
                  {conversation.title || `${conversation.type.replace('_', ' ')} Chat`}
                </h4>
                {conversation.type === 'emergency' && (
                  <Badge variant="destructive" className="text-xs">Emergency</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {conversation.type.replace('_', ' ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-muted/5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    {conversations.find(c => c.id === activeConversation)?.title || 'Chat'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {conversations.find(c => c.id === activeConversation)?.type.replace('_', ' ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getRoleColor(message.sender_role)}>
                      {message.sender_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.sender_name}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.sender_role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.created_at)}
                      </span>
                      {message.is_urgent && (
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg max-w-lg ${
                      message.message_type === 'emergency' 
                        ? 'bg-red-100 border border-red-200' 
                        : 'bg-muted/20'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Mic className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};