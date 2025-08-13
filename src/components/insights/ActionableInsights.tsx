import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  Heart, 
  Apple, 
  Dumbbell, 
  Calendar,
  Target,
  CheckCircle,
  ArrowRight,
  Pill,
  Clock,
  Activity
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'recommendation' | 'alert' | 'achievement' | 'reminder';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'diet' | 'exercise' | 'medication' | 'monitoring' | 'appointment';
  icon: React.ComponentType<any>;
  impact: string;
}

const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'recommendation',
    title: 'Plant-Based Diet Benefits',
    description: 'Your cholesterol levels could improve by 15-20% with a plant-based diet. Studies show this can reduce cardiovascular risk significantly.',
    action: 'Start with 3 plant-based meals per week',
    priority: 'high',
    category: 'diet',
    icon: Apple,
    impact: '15-20% cholesterol reduction'
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'Morning Walk Routine',
    description: 'Based on your BP readings, a 30-minute morning walk could lower your systolic pressure by 5-10 mmHg.',
    action: 'Schedule daily 7 AM walks',
    priority: 'high',
    category: 'exercise',
    icon: Dumbbell,
    impact: '5-10 mmHg BP reduction'
  },
  {
    id: '3',
    type: 'alert',
    title: 'Medication Timing Optimization',
    description: 'Taking blood pressure medication at bedtime instead of morning can be 34% more effective.',
    action: 'Consult doctor about timing change',
    priority: 'medium',
    category: 'medication',
    icon: Pill,
    impact: '34% better efficacy'
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Consistency Milestone!',
    description: 'You\'ve tracked your vitals for 14 days straight! This consistency helps identify patterns.',
    priority: 'low',
    category: 'monitoring',
    icon: Target,
    impact: 'Better health patterns'
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Stress Management Check',
    description: 'Elevated BP readings often correlate with stress. Consider meditation or breathing exercises.',
    action: 'Try 10-min daily meditation',
    priority: 'medium',
    category: 'exercise',
    icon: Heart,
    impact: 'Stress-related BP improvement'
  }
];

interface ActionableInsightsProps {
  role?: 'patient' | 'caregiver' | 'provider';
}

export const ActionableInsights: React.FC<ActionableInsightsProps> = ({ role = 'patient' }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'text-primary border-primary bg-primary/10';
      case 'alert': return 'text-health-warning border-health-warning bg-health-warning/10';
      case 'achievement': return 'text-health-excellent border-health-excellent bg-health-excellent/10';
      case 'reminder': return 'text-secondary border-secondary bg-secondary/10';
      default: return 'text-muted-foreground border-muted bg-muted/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-health-critical text-on-primary';
      case 'medium': return 'bg-health-warning text-on-primary';
      case 'low': return 'bg-health-good text-on-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'diet': return Apple;
      case 'exercise': return Dumbbell;
      case 'medication': return Pill;
      case 'monitoring': return Activity;
      case 'appointment': return Calendar;
      default: return Lightbulb;
    }
  };

  return (
    <Card className="card-premium">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-accessible-lg">Actionable Health Insights</CardTitle>
            <CardDescription className="text-accessible-base">
              Personalized recommendations based on your health data
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockInsights.map((insight) => {
            const Icon = insight.icon;
            const CategoryIcon = getCategoryIcon(insight.category);
            
            return (
              <Card key={insight.id} className={`border transition-all hover:shadow-md ${getTypeColor(insight.type)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-background rounded-lg">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-accessible-base font-medium">{insight.title}</h4>
                            <Badge className={getPriorityColor(insight.priority)}>
                              {insight.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <CategoryIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-accessible-xs text-muted-foreground capitalize">
                              {insight.category}
                            </span>
                          </div>
                        </div>
                        
                        {insight.type === 'achievement' && (
                          <CheckCircle className="h-5 w-5 text-health-excellent" />
                        )}
                      </div>
                      
                      <p className="text-accessible-sm text-muted-foreground">
                        {insight.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-accessible-xs">
                          <TrendingUp className="h-3 w-3 text-health-good" />
                          <span className="font-medium text-health-good">Impact: {insight.impact}</span>
                        </div>
                        
                        {insight.action && (
                          <Button variant="outline" size="sm" className="text-accessible-xs">
                            {insight.action}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-accessible-base font-medium text-primary mb-1">
                Weekly Insight Summary
              </h5>
              <p className="text-accessible-sm text-muted-foreground">
                {mockInsights.filter(i => i.priority === 'high').length} high-priority recommendations • 
                {mockInsights.filter(i => i.type === 'achievement').length} achievements unlocked
              </p>
            </div>
            <Button variant="outline" size="sm">
              View All Insights
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};