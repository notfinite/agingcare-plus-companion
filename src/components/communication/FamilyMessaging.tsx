import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Phone, Video, Users, Bell, Plus } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'health-alert' | 'appointment';
}

export const FamilyMessaging: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const familyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Primary Caregiver',
      status: 'online',
      unreadCount: 2
    },
    {
      id: '2', 
      name: 'Dr. Martinez',
      role: 'Primary Care Doctor',
      status: 'busy',
      lastSeen: '2 hours ago'
    },
    {
      id: '3',
      name: 'Michael Johnson',
      role: 'Family Member',
      status: 'offline',
      lastSeen: 'Yesterday',
      unreadCount: 1
    },
    {
      id: '4',
      name: 'Care Team',
      role: 'Group Chat',
      status: 'online',
      unreadCount: 3
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      content: 'How are you feeling today? Did you take your morning medications?',
      timestamp: new Date(Date.now() - 30 * 60000),
      type: 'text'
    },
    {
      id: '2',
      senderId: '2',
      content: 'Appointment reminder: Cardiology visit tomorrow at 2 PM',
      timestamp: new Date(Date.now() - 60 * 60000),
      type: 'appointment'
    },
    {
      id: '3',
      senderId: 'system',
      content: 'Blood pressure reading was slightly elevated this morning',
      timestamp: new Date(Date.now() - 90 * 60000),
      type: 'health-alert'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getMessageTypeStyle = (type: string) => {
    switch (type) {
      case 'health-alert': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'appointment': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-white border-gray-200';
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    // Send message logic here
    setNewMessage('');
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Family & Care Team Communication
          <Button variant="outline" size="sm" className="ml-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 h-[calc(100%-5rem)]">
        <div className="flex h-full">
          {/* Contacts Sidebar */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-4 space-y-3">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedMember === member.id ? 'bg-primary/5 border border-primary/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{member.name}</p>
                        {member.unreadCount && (
                          <Badge variant="destructive" className="text-xs h-5 min-w-5 px-1">
                            {member.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      {member.status === 'offline' && member.lastSeen && (
                        <p className="text-xs text-muted-foreground">Last seen {member.lastSeen}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedMember ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-xs">
                          {familyMembers.find(m => m.id === selectedMember)?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {familyMembers.find(m => m.id === selectedMember)?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {familyMembers.find(m => m.id === selectedMember)?.role}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg max-w-[80%] ${
                        message.senderId === 'system' 
                          ? `mx-auto text-center ${getMessageTypeStyle(message.type)}`
                          : message.senderId === 'user'
                          ? 'ml-auto bg-primary text-primary-foreground'
                          : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a contact to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};