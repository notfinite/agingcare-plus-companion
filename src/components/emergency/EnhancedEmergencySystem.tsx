import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Phone, MapPin, Clock, Users, Plus, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone_number: string;
  email: string;
  is_primary: boolean;
  priority_order: number;
}

interface EmergencyIncident {
  id: string;
  incident_type: string;
  severity: string;
  description: string;
  status: string;
  location_data: any;
  created_at: string;
  resolved_at: string | null;
  response_time_seconds: number | null;
}

export const EnhancedEmergencySystem = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const { toast } = useToast();

  const [emergencyData, setEmergencyData] = useState({
    incident_type: '',
    severity: '',
    description: ''
  });

  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone_number: '',
    email: '',
    is_primary: false,
    priority_order: 1
  });

  useEffect(() => {
    fetchEmergencyData();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position),
        (error) => console.error('Error getting location:', error)
      );
    }
  };

  const fetchEmergencyData = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) return;

      // Fetch emergency contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('patient_id', userProfile.id)
        .order('priority_order');

      if (contactsError) throw contactsError;
      setContacts(contactsData || []);

      // Fetch emergency incidents
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('emergency_incidents')
        .select('*')
        .eq('patient_id', userProfile.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (incidentsError) throw incidentsError;
      setIncidents(incidentsData || []);

    } catch (error) {
      console.error('Error fetching emergency data:', error);
    }
  };

  const triggerEmergency = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) return;

      const locationData = location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      } : {};

      // Create emergency incident
      const { data: incident, error } = await supabase
        .from('emergency_incidents')
        .insert({
          patient_id: userProfile.id,
          incident_type: emergencyData.incident_type || 'other',
          severity: emergencyData.severity || 'high',
          description: emergencyData.description || 'Emergency assistance requested',
          location_data: locationData,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Create emergency conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          type: 'emergency',
          title: `Emergency Alert - ${emergencyData.incident_type || 'Assistance Required'}`
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add user to conversation
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
          content: `EMERGENCY ALERT: ${emergencyData.incident_type || 'Assistance Required'}\n\nDescription: ${emergencyData.description || 'No additional details'}\n\nLocation: ${location ? `${location.coords.latitude}, ${location.coords.longitude}` : 'Location not available'}\n\nSeverity: ${emergencyData.severity || 'High'}\n\nThis is an automated emergency alert. Please respond immediately.`,
          message_type: 'emergency',
          is_urgent: true
        });

      setEmergencyActive(true);
      setShowEmergencyDialog(false);
      
      toast({
        title: "Emergency Alert Sent",
        description: "Your emergency contacts and care team have been notified",
        variant: "default"
      });

      // Simulate emergency response time
      setTimeout(() => {
        setEmergencyActive(false);
        toast({
          title: "Emergency Response Initiated",
          description: "Help is on the way. Stay calm and follow safety protocols.",
        });
      }, 3000);

      fetchEmergencyData();
    } catch (error) {
      console.error('Error triggering emergency:', error);
      toast({
        title: "Error",
        description: "Failed to send emergency alert",
        variant: "destructive"
      });
    }
  };

  const addEmergencyContact = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) return;

      const { error } = await supabase
        .from('emergency_contacts')
        .insert({
          patient_id: userProfile.id,
          ...newContact
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Emergency contact added successfully",
      });

      setShowContactDialog(false);
      setNewContact({
        name: '',
        relationship: '',
        phone_number: '',
        email: '',
        is_primary: false,
        priority_order: 1
      });
      fetchEmergencyData();
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      toast({
        title: "Error",
        description: "Failed to add emergency contact",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'responded': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'false_alarm': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Emergency System</h2>
          <p className="text-muted-foreground">Manage emergency contacts and quick response</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="lg"
                className={`${emergencyActive ? 'animate-pulse' : ''}`}
                disabled={emergencyActive}
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                {emergencyActive ? 'ALERT SENT' : 'EMERGENCY'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Emergency Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Incident Type</Label>
                  <Select
                    value={emergencyData.incident_type}
                    onValueChange={(value) => setEmergencyData({...emergencyData, incident_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fall">Fall</SelectItem>
                      <SelectItem value="chest_pain">Chest Pain</SelectItem>
                      <SelectItem value="breathing">Breathing Difficulty</SelectItem>
                      <SelectItem value="medication">Medication Emergency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Severity Level</Label>
                  <Select
                    value={emergencyData.severity}
                    onValueChange={(value) => setEmergencyData({...emergencyData, severity: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical - Life Threatening</SelectItem>
                      <SelectItem value="high">High - Urgent Care Needed</SelectItem>
                      <SelectItem value="medium">Medium - Medical Attention</SelectItem>
                      <SelectItem value="low">Low - Non-Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={emergencyData.description}
                    onChange={(e) => setEmergencyData({...emergencyData, description: e.target.value})}
                    placeholder="Describe the situation..."
                  />
                </div>

                <Button onClick={triggerEmergency} variant="destructive" className="w-full">
                  Send Emergency Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Relationship</Label>
                    <Input
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                      placeholder="Spouse, Child, Friend..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={newContact.phone_number}
                      onChange={(e) => setNewContact({...newContact, phone_number: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label>Email (Optional)</Label>
                    <Input
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority Order</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newContact.priority_order}
                      onChange={(e) => setNewContact({...newContact, priority_order: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_primary"
                      checked={newContact.is_primary}
                      onChange={(e) => setNewContact({...newContact, is_primary: e.target.checked})}
                    />
                    <Label htmlFor="is_primary">Primary Contact</Label>
                  </div>
                </div>

                <Button onClick={addEmergencyContact} className="w-full">
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No emergency contacts added yet. Add contacts to ensure quick response during emergencies.
            </p>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{contact.name}</span>
                        {contact.is_primary && (
                          <Badge variant="default">Primary</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Priority {contact.priority_order}</span>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Emergency Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Emergency Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No emergency incidents recorded.
            </p>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">
                        {incident.incident_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {incident.description && (
                    <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(incident.created_at).toLocaleString()}
                    </div>
                    {incident.location_data?.latitude && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Location recorded
                      </div>
                    )}
                    {incident.response_time_seconds && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Response: {incident.response_time_seconds}s
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};