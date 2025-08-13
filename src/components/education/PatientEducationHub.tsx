import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Search, BookOpen, PlayCircle, FileText, CheckSquare, Star, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EducationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
}

interface EducationResource {
  id: string;
  title: string;
  description: string;
  content: string;
  resource_type: 'article' | 'video' | 'infographic' | 'quiz' | 'checklist';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_read_time: number;
  tags: string[];
  is_featured: boolean;
  view_count: number;
  category: EducationCategory;
}

interface EducationProgress {
  resource_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  time_spent_minutes: number;
  completed_at: string | null;
}

export const PatientEducationHub = () => {
  const [categories, setCategories] = useState<EducationCategory[]>([]);
  const [resources, setResources] = useState<EducationResource[]>([]);
  const [progress, setProgress] = useState<Record<string, EducationProgress>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEducationData();
  }, []);

  const fetchEducationData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('education_categories')
        .select('*')
        .order('sort_order');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('education_resources')
        .select(`
          *,
          category:category_id (*)
        `)
        .order('created_at', { ascending: false });

      if (resourcesError) throw resourcesError;
      setResources((resourcesData || []) as EducationResource[]);

      // Fetch user progress
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userProfile) {
        const { data: progressData, error: progressError } = await supabase
          .from('patient_education_progress')
          .select('*')
          .eq('patient_id', userProfile.id);

        if (progressError) throw progressError;

        const progressMap = (progressData || []).reduce((acc, item) => {
          acc[item.resource_id] = item as EducationProgress;
          return acc;
        }, {} as Record<string, EducationProgress>);

        setProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching education data:', error);
      toast({
        title: "Error",
        description: "Failed to load education resources",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markResourceAsStarted = async (resourceId: string) => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) return;

      const { error } = await supabase
        .from('patient_education_progress')
        .upsert({
          patient_id: userProfile.id,
          resource_id: resourceId,
          status: 'in_progress',
          progress_percentage: 10
        });

      if (error) throw error;

      setProgress(prev => ({
        ...prev,
        [resourceId]: {
          resource_id: resourceId,
          status: 'in_progress',
          progress_percentage: 10,
          time_spent_minutes: 0,
          completed_at: null
        }
      }));

      toast({
        title: "Started Learning",
        description: "Your progress has been saved",
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const markResourceAsCompleted = async (resourceId: string) => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) return;

      const { error } = await supabase
        .from('patient_education_progress')
        .upsert({
          patient_id: userProfile.id,
          resource_id: resourceId,
          status: 'completed',
          progress_percentage: 100,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      setProgress(prev => ({
        ...prev,
        [resourceId]: {
          resource_id: resourceId,
          status: 'completed',
          progress_percentage: 100,
          time_spent_minutes: prev[resourceId]?.time_spent_minutes || 0,
          completed_at: new Date().toISOString()
        }
      }));

      toast({
        title: "Completed!",
        description: "Great job! Keep learning to improve your health knowledge.",
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-5 w-5" />;
      case 'video': return <PlayCircle className="h-5 w-5" />;
      case 'infographic': return <BookOpen className="h-5 w-5" />;
      case 'quiz': return <CheckSquare className="h-5 w-5" />;
      case 'checklist': return <CheckSquare className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || resource.category.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const completedResources = Object.values(progress).filter(p => p.status === 'completed').length;
  const inProgressResources = Object.values(progress).filter(p => p.status === 'in_progress').length;

  if (loading) {
    return <div>Loading education resources...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Patient Education Hub</h2>
          <p className="text-muted-foreground">Learn about your health and improve your well-being</p>
        </div>
        
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedResources}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{inProgressResources}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round((completedResources / resources.length) * 100)}%</span>
              </div>
              <Progress value={(completedResources / resources.length) * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{resources.length}</div>
                <div className="text-xs text-muted-foreground">Total Resources</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">{inProgressResources}</div>
                <div className="text-xs text-muted-foreground">Currently Learning</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">{completedResources}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" onClick={() => setSelectedCategory(null)}>All</TabsTrigger>
          {categories.slice(0, 4).map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Featured Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Featured Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.filter(r => r.is_featured).slice(0, 3).map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.resource_type)}
                        <Badge variant="outline" className="text-xs">
                          {resource.resource_type}
                        </Badge>
                      </div>
                      <Badge className={getDifficultyColor(resource.difficulty_level)}>
                        {resource.difficulty_level}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock className="h-3 w-3" />
                      {resource.estimated_read_time} min read
                    </div>

                    {progress[resource.id] && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{progress[resource.id].progress_percentage}%</span>
                        </div>
                        <Progress value={progress[resource.id].progress_percentage} className="h-1" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!progress[resource.id] || progress[resource.id].status === 'not_started' ? (
                        <Button 
                          size="sm" 
                          onClick={() => markResourceAsStarted(resource.id)}
                          className="flex-1"
                        >
                          Start Learning
                        </Button>
                      ) : progress[resource.id].status === 'in_progress' ? (
                        <Button 
                          size="sm" 
                          onClick={() => markResourceAsCompleted(resource.id)}
                          className="flex-1"
                        >
                          Mark Complete
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Completed ✓
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">All Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.resource_type)}
                        <Badge variant="outline" className="text-xs">
                          {resource.resource_type}
                        </Badge>
                      </div>
                      <Badge className={getDifficultyColor(resource.difficulty_level)}>
                        {resource.difficulty_level}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock className="h-3 w-3" />
                      {resource.estimated_read_time} min read
                    </div>

                    {progress[resource.id] && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{progress[resource.id].progress_percentage}%</span>
                        </div>
                        <Progress value={progress[resource.id].progress_percentage} className="h-1" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!progress[resource.id] || progress[resource.id].status === 'not_started' ? (
                        <Button 
                          size="sm" 
                          onClick={() => markResourceAsStarted(resource.id)}
                          className="flex-1"
                        >
                          Start Learning
                        </Button>
                      ) : progress[resource.id].status === 'in_progress' ? (
                        <Button 
                          size="sm" 
                          onClick={() => markResourceAsCompleted(resource.id)}
                          className="flex-1"
                        >
                          Mark Complete
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Completed ✓
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};