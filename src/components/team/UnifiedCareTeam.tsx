import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  Phone,
  Mail,
  Share2,
  Plus,
  Search
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  last_active: string;
}

interface CareTask {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  assigned_by: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  patient_id: string;
}

interface CareNote {
  id: string;
  content: string;
  author: string;
  type: 'assessment' | 'plan' | 'observation' | 'medication';
  created_at: string;
}

export const UnifiedCareTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [careTasks, setCareTasks] = useState<CareTask[]>([]);
  const [careNotes, setCareNotes] = useState<CareNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCareTeamData();
  }, []);

  const fetchCareTeamData = async () => {
    try {
      setLoading(true);
      
      // Simulate care team data
      setTeamMembers([
        {
          id: '1',
          name: 'Dr. Sarah Chen',
          role: 'Primary Care Physician',
          specialty: 'Internal Medicine',
          status: 'online',
          last_active: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Maria Rodriguez, RN',
          role: 'Care Coordinator',
          specialty: 'Care Management',
          status: 'online',
          last_active: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Dr. James Wilson',
          role: 'Cardiologist',
          specialty: 'Cardiology',
          status: 'busy',
          last_active: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          name: 'Lisa Thompson, PharmD',
          role: 'Clinical Pharmacist',
          specialty: 'Pharmacy',
          status: 'offline',
          last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          name: 'Michael Brown',
          role: 'Social Worker',
          specialty: 'Social Services',
          status: 'online',
          last_active: new Date().toISOString()
        }
      ]);

      setCareTasks([
        {
          id: '1',
          title: 'Review latest lab results',
          description: 'Analyze HbA1c and lipid panel results from yesterday',
          assigned_to: '1',
          assigned_by: '2',
          priority: 'high',
          status: 'pending',
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          patient_id: 'patient1'
        },
        {
          id: '2',
          title: 'Medication reconciliation',
          description: 'Verify current medications and check for interactions',
          assigned_to: '4',
          assigned_by: '1',
          priority: 'medium',
          status: 'in_progress',
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          patient_id: 'patient1'
        },
        {
          id: '3',
          title: 'Schedule cardiology follow-up',
          description: 'Book appointment for BP management review',
          assigned_to: '2',
          assigned_by: '3',
          priority: 'medium',
          status: 'pending',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          patient_id: 'patient1'
        }
      ]);

      setCareNotes([
        {
          id: '1',
          content: 'Patient reports improved energy levels since starting new medication regimen. No adverse effects noted.',
          author: 'Dr. Sarah Chen',
          type: 'assessment',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          content: 'Increased Metformin to 1000mg BID. Monitor for GI tolerance. Next review in 2 weeks.',
          author: 'Dr. Sarah Chen',
          type: 'medication',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          content: 'Patient connected with diabetes educator for nutritional counseling. First session scheduled for next week.',
          author: 'Maria Rodriguez, RN',
          type: 'plan',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]);

    } catch (error) {
      console.error('Error fetching care team data:', error);
      toast({
        title: "Error",
        description: "Failed to load care team data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'border-blue-200 bg-blue-50';
      case 'plan': return 'border-green-200 bg-green-50';
      case 'medication': return 'border-purple-200 bg-purple-50';
      case 'observation': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const addNewTask = async () => {
    if (!newTaskTitle.trim() || !selectedMember) return;

    const newTask: CareTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: '',
      assigned_to: selectedMember.id,
      assigned_by: '1', // Current user
      priority: 'medium',
      status: 'pending',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      patient_id: 'patient1'
    };

    setCareTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setSelectedMember(null);

    toast({
      title: "Task Assigned",
      description: `Task assigned to ${selectedMember.name}`,
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading care team...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Unified Care Team Platform
          </h2>
          <p className="text-muted-foreground">Seamless collaboration across all care stakeholders</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4 mr-2" />
            Team Meeting
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Task Title</label>
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task description..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Assign To</label>
                  <div className="grid gap-2 mt-2">
                    {teamMembers.map((member) => (
                      <div 
                        key={member.id}
                        className={`p-2 border rounded cursor-pointer ${
                          selectedMember?.id === member.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedMember(member)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={addNewTask} className="w-full">
                  Assign Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="tasks">Care Tasks</TabsTrigger>
          <TabsTrigger value="notes">Care Notes</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      {member.specialty && (
                        <Badge variant="outline" className="text-xs mt-1">{member.specialty}</Badge>
                      )}
                      
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {member.status === 'online' ? 'Active now' : 
                         `Last active ${new Date(member.last_active).toLocaleTimeString()}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4">
            {careTasks.map((task) => {
              const assignedMember = teamMembers.find(m => m.id === task.assigned_to);
              const assignedBy = teamMembers.find(m => m.id === task.assigned_by);
              
              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3">
                        {getTaskStatusIcon(task.status)}
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Assigned to: {assignedMember?.name}</span>
                        <span>By: {assignedBy?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="space-y-4">
            {careNotes.map((note) => (
              <Card key={note.id} className={`${getNoteTypeColor(note.type)} border`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium text-sm capitalize">{note.type}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(note.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <p className="text-sm mb-2">{note.content}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      By: {note.author}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Dr. Sarah Chen</p>
                      <p className="text-xs text-muted-foreground">Lab results discussion</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Maria Rodriguez, RN</p>
                      <p className="text-xs text-muted-foreground">Care plan updates</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scheduled Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">Weekly Care Team Review</h4>
                      <Badge variant="outline">Tomorrow</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Review patient progress and care plan adjustments
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      10:00 AM - 11:00 AM
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">Cardiology Consultation</h4>
                      <Badge variant="outline">Friday</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Discuss BP management strategy
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      2:00 PM - 2:30 PM
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};