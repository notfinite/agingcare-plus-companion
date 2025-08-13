import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Calendar, 
  MessageSquare, 
  Activity, 
  Users, 
  AlertTriangle, 
  Stethoscope, 
  Sparkles,
  Brain,
  BarChart3
} from 'lucide-react';

interface QuickActionsBarProps {
  persona: string;
}

export function QuickActionsBar({ persona }: QuickActionsBarProps) {
  const navigate = useNavigate();

  const getQuickActions = () => {
    switch (persona) {
      case 'patient':
        return [
          { 
            icon: Sparkles, 
            label: 'AI Care', 
            path: '/compassionate-care',
            color: 'bg-compassion-primary/10 text-compassion-primary hover:bg-compassion-primary/20'
          },
          { 
            icon: Heart, 
            label: 'Vitals', 
            path: '/health',
            color: 'bg-health-excellent/10 text-health-excellent hover:bg-health-excellent/20'
          },
          { 
            icon: Activity, 
            label: 'Meds', 
            path: '/medications',
            color: 'bg-primary/10 text-primary hover:bg-primary/20'
          },
          { 
            icon: MessageSquare, 
            label: 'Family', 
            path: '/family',
            color: 'bg-secondary/10 text-secondary hover:bg-secondary/20'
          },
          { 
            icon: Calendar, 
            label: 'Appts', 
            path: '/appointments',
            color: 'bg-muted/50 text-foreground hover:bg-muted'
          }
        ];
      
      case 'caregiver':
        return [
          { 
            icon: Users, 
            label: 'Patients', 
            path: '/patients',
            color: 'bg-primary/10 text-primary hover:bg-primary/20'
          },
          { 
            icon: AlertTriangle, 
            label: 'Alerts', 
            path: '/alerts',
            color: 'bg-health-warning/10 text-health-warning hover:bg-health-warning/20'
          },
          { 
            icon: Heart, 
            label: 'Health', 
            path: '/health',
            color: 'bg-health-excellent/10 text-health-excellent hover:bg-health-excellent/20'
          },
          { 
            icon: MessageSquare, 
            label: 'Family', 
            path: '/family',
            color: 'bg-secondary/10 text-secondary hover:bg-secondary/20'
          },
          { 
            icon: Sparkles, 
            label: 'Support', 
            path: '/compassionate-care',
            color: 'bg-compassion-primary/10 text-compassion-primary hover:bg-compassion-primary/20'
          }
        ];
      
      case 'provider':
        return [
          { 
            icon: Users, 
            label: 'Panel', 
            path: '/patients',
            color: 'bg-primary/10 text-primary hover:bg-primary/20'
          },
          { 
            icon: AlertTriangle, 
            label: 'Alerts', 
            path: '/alerts',
            color: 'bg-health-critical/10 text-health-critical hover:bg-health-critical/20'
          },
          { 
            icon: Brain, 
            label: 'Risk AI', 
            path: '/ai-assessment',
            color: 'bg-secondary/10 text-secondary hover:bg-secondary/20'
          },
          { 
            icon: BarChart3, 
            label: 'Analytics', 
            path: '/analytics',
            color: 'bg-health-good/10 text-health-good hover:bg-health-good/20'
          },
          { 
            icon: Stethoscope, 
            label: 'Telehealth', 
            path: '/telehealth',
            color: 'bg-muted/50 text-foreground hover:bg-muted'
          }
        ];
      
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  if (quickActions.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-border/50 px-4 py-3">
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-sm font-medium text-muted-foreground mr-2 flex-shrink-0">
          Quick Actions:
        </span>
        <div className="flex gap-2">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.label}
                onClick={() => navigate(action.path)}
                variant="ghost"
                size="sm"
                className={`flex-shrink-0 h-8 px-3 rounded-full transition-smooth ${action.color}`}
              >
                <IconComponent className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}