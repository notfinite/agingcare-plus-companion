import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  UserPlus, 
  Heart, 
  Trash2, 
  Search, 
  Users, 
  Activity,
  TrendingUp,
  Clock,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Patient {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  relationship_type: string;
  primary_diagnosis?: string[];
  last_contact?: string;
  status: 'active' | 'inactive' | 'critical';
  risk_level: 'low' | 'medium' | 'high';
  medication_adherence?: number;
}

export const PatientManagement = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    full_name: '',
    email: '',
    phone: '',
    relationship_type: '',
    date_of_birth: ''
  });

  useEffect(() => {
    if (profile) {
      fetchPatients();
    }
  }, [profile]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      // Get patient relationships for caregivers
      const { data: relationships, error: relationshipError } = await supabase
        .from('caregiver_patient_relationships')
        .select(`
          *,
          patient_profile:profiles!caregiver_patient_relationships_patient_id_fkey(
            id,
            full_name,
            email,
            phone,
            date_of_birth
          )
        `)
        .eq('caregiver_id', profile?.id);

      if (relationshipError) throw relationshipError;

      // Transform data for display
      const transformedPatients = relationships?.map(rel => ({
        id: rel.id,
        profile_id: rel.patient_id,
        full_name: rel.patient_profile?.full_name || 'Unknown',
        email: rel.patient_profile?.email || '',
        phone: rel.patient_profile?.phone,
        date_of_birth: rel.patient_profile?.date_of_birth,
        relationship_type: rel.relationship_type,
        primary_diagnosis: ['Hypertension', 'Diabetes'], // Mock data for now
        last_contact: new Date().toISOString(),
        status: 'active' as const,
        risk_level: 'low' as const,
        medication_adherence: Math.floor(Math.random() * 20) + 80
      })) || [];

      setPatients(transformedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error loading patients",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async () => {
    if (!profile || !newPatient.full_name || !newPatient.email || !newPatient.relationship_type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields (name, email, and relationship).",
        variant: "destructive",
      });
      return;
    }

    if (!newPatient.email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('find_or_create_patient_by_email', {
          patient_email: newPatient.email,
          patient_name: newPatient.full_name,
          relationship_type: newPatient.relationship_type
        });

      if (error) throw error;

      toast({
        title: "Patient added successfully",
        description: `${newPatient.full_name} has been added to your care list.`,
      });

      setNewPatient({
        full_name: '',
        email: '',
        phone: '',
        relationship_type: '',
        date_of_birth: ''
      });
      setIsAddingPatient(false);
      fetchPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: "Error adding patient",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const removePatient = async (relationshipId: string, patientName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${patientName} from your patient list? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('caregiver_patient_relationships')
        .delete()
        .eq('id', relationshipId);

      if (error) throw error;

      toast({
        title: "Patient removed",
        description: `${patientName} has been removed from your care list.`,
      });

      fetchPatients();
    } catch (error) {
      console.error('Error removing patient:', error);
      toast({
        title: "Error removing patient",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-health-good border-health-good bg-health-good/10';
      case 'critical': return 'text-health-critical border-health-critical bg-health-critical/10';
      case 'inactive': return 'text-muted-foreground border-muted bg-muted/10';
      default: return 'text-muted-foreground border-muted bg-muted/10';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-health-critical border-health-critical';
      case 'medium': return 'text-health-warning border-health-warning';
      case 'low': return 'text-health-good border-health-good';
      default: return 'text-muted-foreground border-muted';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg">Patient Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading patients...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-premium hover-lift">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-primary/20 rounded-lg mr-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-accessible-2xl font-bold text-primary">{patients.length}</p>
              <p className="text-accessible-sm text-muted-foreground">Total Patients</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium hover-lift">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-health-good/20 rounded-lg mr-4">
              <Activity className="h-6 w-6 text-health-good" />
            </div>
            <div>
              <p className="text-accessible-2xl font-bold text-health-good">
                {patients.filter(p => p.status === 'active').length}
              </p>
              <p className="text-accessible-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium hover-lift">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-health-warning/20 rounded-lg mr-4">
              <TrendingUp className="h-6 w-6 text-health-warning" />
            </div>
            <div>
              <p className="text-accessible-2xl font-bold text-health-warning">
                {Math.round(patients.reduce((acc, p) => acc + (p.medication_adherence || 0), 0) / patients.length || 0)}%
              </p>
              <p className="text-accessible-sm text-muted-foreground">Avg Adherence</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium hover-lift">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-health-critical/20 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-health-critical" />
            </div>
            <div>
              <p className="text-accessible-2xl font-bold text-health-critical">
                {patients.filter(p => p.risk_level === 'high').length}
              </p>
              <p className="text-accessible-sm text-muted-foreground">High Risk</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-accessible-lg flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Patient Management
              </CardTitle>
              <CardDescription className="text-accessible-base">
                Manage your care recipients and their information
              </CardDescription>
            </div>
            <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-accessible-xl">Add New Patient</DialogTitle>
                  <DialogDescription className="text-accessible-base">
                    Add a patient to your care network
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-accessible-lg">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={newPatient.full_name}
                      onChange={(e) => setNewPatient({...newPatient, full_name: e.target.value})}
                      placeholder="Enter patient's full name"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-accessible-lg">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                      placeholder="patient@example.com"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-accessible-lg">Phone</Label>
                    <Input
                      id="phone"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship" className="text-accessible-lg">Relationship *</Label>
                    <Select 
                      value={newPatient.relationship_type} 
                      onValueChange={(value) => setNewPatient({...newPatient, relationship_type: value})}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="relative">Other Relative</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="professional">Professional Caregiver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth" className="text-accessible-lg">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={newPatient.date_of_birth}
                      onChange={(e) => setNewPatient({...newPatient, date_of_birth: e.target.value})}
                      className="h-12"
                    />
                  </div>

                  <Button onClick={addPatient} className="w-full" size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Patient
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Patient List */}
          <div className="space-y-4">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-accessible-lg font-medium mb-2">No patients found</h3>
                <p className="text-accessible-base text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first patient to your care network.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddingPatient(true)} className="bg-gradient-to-r from-primary to-primary-glow">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add First Patient
                  </Button>
                )}
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <Card key={patient.id} className="card-premium hover-lift transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary-glow/20 text-primary text-accessible-lg font-semibold">
                            {patient.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-accessible-lg font-semibold">{patient.full_name}</h3>
                              <Badge className={getStatusColor(patient.status)}>
                                {patient.status}
                              </Badge>
                              <Badge variant="outline" className={getRiskColor(patient.risk_level)}>
                                {patient.risk_level} risk
                              </Badge>
                            </div>
                            <p className="text-accessible-sm text-muted-foreground capitalize">
                              {patient.relationship_type} • {patient.primary_diagnosis?.join(', ') || 'No diagnosis recorded'}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-accessible-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{patient.email}</span>
                            </div>
                            {patient.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{patient.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Age: {patient.date_of_birth ? 
                                new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() 
                                : 'Unknown'}</span>
                            </div>
                          </div>

                          {patient.medication_adherence && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-accessible-sm">
                                <span className="text-muted-foreground">Medication Adherence</span>
                                <span className="font-medium">{patient.medication_adherence}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    patient.medication_adherence >= 80 ? 'bg-health-good' :
                                    patient.medication_adherence >= 60 ? 'bg-health-warning' : 'bg-health-critical'
                                  }`}
                                  style={{ width: `${patient.medication_adherence}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Activity className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePatient(patient.id, patient.full_name)}
                          className="text-health-critical hover:text-health-critical"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};