import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Bell,
  Video,
  Phone,
  Send,
  Plus,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  avatar?: string;
  is_online: boolean;
  last_seen: string;
  phone?: string;
  email?: string;
}

interface FamilyMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: 'text' | 'update' | 'alert' | 'celebration';
  timestamp: string;
  is_urgent: boolean;
}

interface CareUpdate {
  id: string;
  type: 'medication' | 'appointment' | 'health_metric' | 'mood';
  title: string;
  description: string;
  timestamp: string;
  shared_with_family: boolean;
}

export const FamilyConnection = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [messages, setMessages] = useState<FamilyMessage[]>([]);
  const [careUpdates, setCareUpdates] = useState<CareUpdate[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelationship, setNewMemberRelationship] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchFamilyData();
    setupRealtimeSubscription();
  }, []);

  const fetchFamilyData = async () => {
    try {
      // Simulate family members data
      setFamilyMembers([
        {
          id: '1',
          name: 'Sarah Johnson',
          relationship: 'Daughter',
          is_online: true,
          last_seen: new Date().toISOString(),
          phone: '+1-555-0123',
          email: 'sarah@email.com'
        },
        {
          id: '2',
          name: 'Michael Johnson',
          relationship: 'Son',
          is_online: false,
          last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          phone: '+1-555-0124'
        },
        {
          id: '3',
          name: 'Dr. Lisa Chen',
          relationship: 'Primary Care Doctor',
          is_online: true,
          last_seen: new Date().toISOString(),
          phone: '+1-555-0125'
        },
        {
          id: '4',
          name: 'Emma Williams',
          relationship: 'Caregiver',
          is_online: true,
          last_seen: new Date().toISOString(),
          phone: '+1-555-0126'
        }
      ]);

      setMessages([
        {
          id: '1',
          sender_id: '1',
          sender_name: 'Sarah',
          content: 'Hi Mom! How are you feeling today? Remember to take your morning medications. Love you! ❤️',
          message_type: 'text',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          is_urgent: false
        },
        {
          id: '2',
          sender_id: '3',
          sender_name: 'Dr. Chen',
          content: 'Your recent lab results look great! Blood pressure is well controlled. Keep up the good work!',
          message_type: 'update',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          is_urgent: false
        },
        {
          id: '3',
          sender_id: '4',
          sender_name: 'Emma',
          content: 'Medication reminder completed ✅ Blood pressure checked: 125/80 - looking good!',
          message_type: 'update',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          is_urgent: false
        }
      ]);

      setCareUpdates([
        {
          id: '1',
          type: 'medication',
          title: 'Morning medications taken',
          description: 'Lisinopril 10mg, Metformin 500mg completed at 8:30 AM',
          timestamp: new Date().toISOString(),
          shared_with_family: true
        },
        {
          id: '2',
          type: 'health_metric',
          title: 'Blood pressure recorded',
          description: '125/80 mmHg - within target range',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          shared_with_family: true
        },
        {
          id: '3',
          type: 'mood',
          title: 'Daily mood check',
          description: 'Feeling good today - energy level 8/10',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          shared_with_family: false
        }
      ]);
    } catch (error) {
      console.error('Error fetching family data:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('family-updates')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Family presence updated:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Family member joined:', key, newPresences);
        toast({
          title: "Family Member Online",
          description: "A family member just came online",
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Family member left:', key, leftPresences);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: FamilyMessage = {
      id: Date.now().toString(),
      sender_id: 'current_user',
      sender_name: 'You',
      content: newMessage,
      message_type: 'text',
      timestamp: new Date().toISOString(),
      is_urgent: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Auto-share with family
    toast({
      title: "Message Sent",
      description: "Your message has been shared with your care team",
    });

    // Simulate family member responses
    setTimeout(() => {
      const responses = [
        "Thanks for the update! Glad to hear you're doing well. 💙",
        "Love you too! Don't forget your afternoon walk. 🚶‍♀️",
        "That's wonderful news! Keep taking care of yourself. ❤️"
      ];
      
      const response: FamilyMessage = {
        id: (Date.now() + 1).toString(),
        sender_id: '1',
        sender_name: 'Sarah',
        content: responses[Math.floor(Math.random() * responses.length)],
        message_type: 'text',
        timestamp: new Date().toISOString(),
        is_urgent: false
      };

      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const shareHealthUpdate = async (updateType: string) => {
    const updates = {
      mood: "Feeling energetic and positive today! Had a great morning walk. 😊",
      medication: "Completed all morning medications on time. No side effects noted.",
      activity: "Completed 30-minute gentle exercise routine. Feeling accomplished!",
      appointment: "Just finished telehealth check-in with Dr. Chen. Everything looks good!"
    };

    const update: FamilyMessage = {
      id: Date.now().toString(),
      sender_id: 'current_user',
      sender_name: 'You',
      content: updates[updateType as keyof typeof updates] || "Health update shared",
      message_type: 'update',
      timestamp: new Date().toISOString(),
      is_urgent: false
    };

    setMessages(prev => [...prev, update]);
    
    toast({
      title: "Health Update Shared",
      description: "Your family has been notified of your health update",
    });
  };

  const addFamilyMember = async () => {
    if (!newMemberName.trim() || !newMemberRelationship.trim()) return;

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName,
      relationship: newMemberRelationship,
      is_online: false,
      last_seen: new Date().toISOString(),
      phone: newMemberPhone
    };

    setFamilyMembers(prev => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberRelationship('');
    setNewMemberPhone('');
    setShowAddMember(false);

    toast({
      title: "Family Member Added",
      description: `${newMemberName} has been added to your care circle`,
    });
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'update': return <Heart className="h-4 w-4 text-blue-500" />;
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'celebration': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Family Circle */}
        <Card className="border-compassion-gentle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-compassion-primary">
              <Users className="h-5 w-5" />
              Your Care Circle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-compassion-border hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-compassion-primary text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      member.is_online ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.relationship}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.is_online ? 'Online now' : `Last seen ${new Date(member.last_seen).toLocaleTimeString()}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              className="w-full border-dashed border-compassion-border"
              onClick={() => setShowAddMember(!showAddMember)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member or Caregiver
            </Button>

            {showAddMember && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <Input
                  placeholder="Name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
                <Input
                  placeholder="Relationship (e.g., Son, Caregiver)"
                  value={newMemberRelationship}
                  onChange={(e) => setNewMemberRelationship(e.target.value)}
                />
                <Input
                  placeholder="Phone number (optional)"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={addFamilyMember} size="sm">Add</Button>
                  <Button variant="outline" onClick={() => setShowAddMember(false)} size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Family Messages */}
        <Card className="border-compassion-gentle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-compassion-primary">
              <MessageCircle className="h-5 w-5" />
              Family Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.sender_id === 'current_user' 
                      ? 'bg-compassion-primary text-white ml-8' 
                      : 'bg-white border border-compassion-border'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getMessageIcon(message.message_type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{message.sender_name}</span>
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Share an update with your family..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="resize-none border-compassion-border"
                rows={2}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareHealthUpdate('mood')}
                  >
                    Share Mood
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareHealthUpdate('medication')}
                  >
                    Medication Update
                  </Button>
                </div>
                
                <Button onClick={sendMessage} size="sm" disabled={!newMessage.trim()}>
                  <Send className="h-3 w-3 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Care Updates */}
      <Card className="border-compassion-gentle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-compassion-primary">
            <Bell className="h-5 w-5" />
            Recent Care Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {careUpdates.map((update) => (
              <div key={update.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-compassion-border">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    update.type === 'medication' ? 'bg-blue-500' :
                    update.type === 'health_metric' ? 'bg-green-500' :
                    update.type === 'mood' ? 'bg-purple-500' : 'bg-orange-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-sm">{update.title}</h4>
                    <p className="text-xs text-muted-foreground">{update.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(update.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {update.shared_with_family ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Shared
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Share with Family
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};