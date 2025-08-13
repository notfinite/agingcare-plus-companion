import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Users,
  Star,
  ChevronRight,
  Lightbulb,
  Shield,
  Stethoscope,
  MessageSquare
} from 'lucide-react';

interface RecommendationTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  target_audience: string;
  duration_days: number;
  difficulty_level: string;
  action_steps: any;
  success_criteria: any;
  resources: any;
}

interface UserRecommendation {
  id: string;
  recommendation_template_id: string;
  status: string;
  progress_percentage: number;
  target_completion_date: string;
  start_date: string;
  custom_notes: string;
  template?: RecommendationTemplate;
}

export const PersonalizedRecommendations = () => {
  const [templates, setTemplates] = useState<RecommendationTemplate[]>([]);
  const [userRecommendations, setUserRecommendations] = useState<UserRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<RecommendationTemplate | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch recommendation templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('recommendation_templates')
        .select('*')
        .eq('is_active', true)
        .order('duration_days', { ascending: true });

      if (templatesError) throw templatesError;
      setTemplates((templatesData || []).map(template => ({
        ...template,
        action_steps: Array.isArray(template.action_steps) ? template.action_steps : JSON.parse(template.action_steps as string || '[]'),
        success_criteria: typeof template.success_criteria === 'object' ? template.success_criteria : JSON.parse(template.success_criteria as string || '{}'),
        resources: Array.isArray(template.resources) ? template.resources : JSON.parse(template.resources as string || '[]')
      })));

      // Fetch user recommendations
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data: userRecsData, error: userRecsError } = await supabase
          .from('user_recommendations')
          .select(`
            *,
            recommendation_templates(*)
          `)
          .eq('user_id', userData.user.id);

        if (userRecsError) throw userRecsError;
        setUserRecommendations(userRecsData || []);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load recommendations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startRecommendation = async (templateId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + template.duration_days);

      const { error } = await supabase
        .from('user_recommendations')
        .insert({
          user_id: userData.user.id,
          recommendation_template_id: templateId,
          target_completion_date: targetDate.toISOString().split('T')[0],
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recommendation added to your goals",
      });

      fetchData();
    } catch (error) {
      console.error('Error starting recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to start recommendation",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Communication': return <MessageSquare className="h-5 w-5" />;
      case 'Emergency Care': return <Shield className="h-5 w-5" />;
      case 'Patient Engagement': return <Users className="h-5 w-5" />;
      case 'Accessibility': return <Lightbulb className="h-5 w-5" />;
      case 'Clinical Intelligence': return <Stethoscope className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const groupedTemplates = {
    immediate: templates.filter(t => t.duration_days <= 30),
    shortTerm: templates.filter(t => t.duration_days > 30 && t.duration_days <= 60),
    mediumTerm: templates.filter(t => t.duration_days > 60)
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading recommendations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Healthcare Implementation Roadmap</h2>
          <p className="text-muted-foreground">Strategic recommendations for healthcare platform development</p>
        </div>
      </div>

      <Tabs defaultValue="immediate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="immediate">
            Immediate (30 days)
            <Badge variant="secondary" className="ml-2">{groupedTemplates.immediate.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="short-term">
            Short-term (60 days)
            <Badge variant="secondary" className="ml-2">{groupedTemplates.shortTerm.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="medium-term">
            Medium-term (90 days)
            <Badge variant="secondary" className="ml-2">{groupedTemplates.mediumTerm.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="immediate" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {groupedTemplates.immediate.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(template.category)}
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(template.difficulty_level)}>
                      {template.difficulty_level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{template.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {template.duration_days} days
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {template.target_audience}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Key Steps:</p>
                    {template.action_steps.slice(0, 2).map((step, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{step.step}</span>
                      </div>
                    ))}
                    {template.action_steps.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{template.action_steps.length - 2} more steps
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getCategoryIcon(template.category)}
                            {template.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm">{template.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Timeline & Difficulty</h4>
                              <div className="space-y-1 text-sm">
                                <p>Duration: {template.duration_days} days</p>
                                <p>Difficulty: <Badge className={getDifficultyColor(template.difficulty_level)}>{template.difficulty_level}</Badge></p>
                                <p>Target: {template.target_audience}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Success Metrics</h4>
                              <div className="text-sm space-y-1">
                                {Object.entries(template.success_criteria).map(([key, value]) => (
                                  <p key={key}>{key}: {value as string}</p>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Implementation Steps</h4>
                            <div className="space-y-2">
                              {template.action_steps.map((step, index) => (
                                <div key={index} className="border rounded-lg p-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{step.step}</p>
                                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Resources</h4>
                            <div className="grid gap-2">
                              {template.resources.map((resource, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                  <span>{resource.title} ({resource.type})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm"
                      onClick={() => startRecommendation(template.id)}
                      disabled={userRecommendations.some(ur => ur.recommendation_template_id === template.id)}
                    >
                      {userRecommendations.some(ur => ur.recommendation_template_id === template.id) ? 
                        'Already Added' : 'Add to Goals'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="short-term" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {groupedTemplates.shortTerm.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(template.category)}
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(template.difficulty_level)}>
                      {template.difficulty_level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{template.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {template.duration_days} days
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {template.target_audience}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Key Steps:</p>
                    {template.action_steps.slice(0, 2).map((step, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{step.step}</span>
                      </div>
                    ))}
                    {template.action_steps.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{template.action_steps.length - 2} more steps
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    
                    <Button 
                      size="sm"
                      onClick={() => startRecommendation(template.id)}
                      disabled={userRecommendations.some(ur => ur.recommendation_template_id === template.id)}
                    >
                      {userRecommendations.some(ur => ur.recommendation_template_id === template.id) ? 
                        'Already Added' : 'Add to Goals'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="medium-term" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {groupedTemplates.mediumTerm.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(template.category)}
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(template.difficulty_level)}>
                      {template.difficulty_level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{template.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {template.duration_days} days
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {template.target_audience}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Key Steps:</p>
                    {template.action_steps.slice(0, 2).map((step, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{step.step}</span>
                      </div>
                    ))}
                    {template.action_steps.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{template.action_steps.length - 2} more steps
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    
                    <Button 
                      size="sm"
                      onClick={() => startRecommendation(template.id)}
                      disabled={userRecommendations.some(ur => ur.recommendation_template_id === template.id)}
                    >
                      {userRecommendations.some(ur => ur.recommendation_template_id === template.id) ? 
                        'Already Added' : 'Add to Goals'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Active Goals Section */}
      {userRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Active Implementation Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRecommendations.map((userRec) => (
                <div key={userRec.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{userRec.template?.title}</h4>
                      <p className="text-sm text-muted-foreground">{userRec.template?.category}</p>
                    </div>
                    <Badge variant={userRec.status === 'completed' ? 'default' : 'secondary'}>
                      {userRec.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{userRec.progress_percentage}%</span>
                    </div>
                    <Progress value={userRec.progress_percentage} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                    <span>Target: {new Date(userRec.target_completion_date).toLocaleDateString()}</span>
                    <span>{userRec.template?.duration_days} days</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};