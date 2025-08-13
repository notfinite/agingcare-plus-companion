import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Heart, 
  Calendar, 
  MessageSquare, 
  Activity, 
  Brain, 
  Settings, 
  HelpCircle,
  Stethoscope,
  UserPlus,
  BarChart3,
  Leaf,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

interface NavigationItem {
  title: string;
  url: string;
  icon: any;
  description: string;
  roles?: string[];
}

// Persona-specific navigation with priority ordering
const getPersonaNavigationItems = (persona: string): NavigationItem[] => {
  const allItems: Record<string, NavigationItem> = {
    dashboard: {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
      description: 'Main overview',
      roles: ['patient', 'caregiver', 'provider']
    },
    compassionate: {
      title: 'Compassionate Care',
      url: '/compassionate-care',
      icon: Sparkles,
      description: 'AI companion & support',
      roles: ['patient', 'caregiver', 'provider']
    },
    health: {
      title: 'Health Metrics',
      url: '/health',
      icon: Heart,
      description: 'Vital signs and trends',
      roles: ['patient', 'caregiver', 'provider']
    },
    medication: {
      title: 'Medications',
      url: '/health', // Redirect to health page for now
      icon: Activity,
      description: 'Smart reminders & tracking',
      roles: ['patient', 'caregiver', 'provider']
    },
    family: {
      title: 'Family Circle',
      url: '/compassionate-care', // Redirect to compassionate care for now
      icon: MessageSquare,
      description: 'Family messaging & care',
      roles: ['patient', 'caregiver']
    },
    appointments: {
      title: 'Appointments',
      url: '/appointments',
      icon: Calendar,
      description: 'Schedule management',
      roles: ['patient', 'caregiver', 'provider']
    },
    mood: {
      title: 'Mood & Wellness',
      url: '/compassionate-care', // Redirect to compassionate care for now
      icon: Brain,
      description: 'Mental health tracking',
      roles: ['patient', 'caregiver']
    },
    patients: {
      title: 'Patient Panel',
      url: '/dashboard', // Provider dashboard shows patient panel
      icon: Users,
      description: 'Patient management',
      roles: ['caregiver', 'provider']
    },
    alerts: {
      title: 'Clinical Alerts',
      url: '/dashboard', // Show in dashboard for now
      icon: AlertTriangle,
      description: 'Urgent notifications',
      roles: ['caregiver', 'provider']
    },
    risk: {
      title: 'Risk Assessment',
      url: '/ai-assessment',
      icon: Brain,
      description: 'AI-powered insights',
      roles: ['provider']
    },
    telehealth: {
      title: 'Telehealth',
      url: '/telehealth',
      icon: Stethoscope,
      description: 'Virtual consultations',
      roles: ['patient', 'caregiver', 'provider']
    },
    analytics: {
      title: 'Population Analytics',
      url: '/dashboard', // Provider dashboard has analytics
      icon: BarChart3,
      description: 'Health insights & trends',
      roles: ['provider']
    },
    devices: {
      title: 'Connected Devices',
      url: '/health', // Show in health metrics
      icon: Activity,
      description: 'Health monitoring devices',
      roles: ['patient', 'caregiver', 'provider']
    },
    sustainability: {
      title: 'Sustainability',
      url: '/sustainability',
      icon: Leaf,
      description: 'Green health choices',
      roles: ['patient', 'caregiver', 'provider']
    },
    community: {
      title: 'Community',
      url: '/compassionate-care', // Show in compassionate care for now
      icon: MessageSquare,
      description: 'Support network',
      roles: ['patient', 'caregiver']
    }
  };

  // Persona-specific priority ordering
  const personaOrder: Record<string, string[]> = {
    patient: [
      'dashboard', 'compassionate', 'health', 'medication', 'family', 
      'appointments', 'mood', 'telehealth', 'devices', 'sustainability', 'community'
    ],
    caregiver: [
      'dashboard', 'patients', 'alerts', 'health', 'medication', 'family',
      'compassionate', 'appointments', 'telehealth', 'mood', 'devices', 'sustainability'
    ],
    provider: [
      'dashboard', 'patients', 'alerts', 'risk', 'analytics', 'telehealth',
      'appointments', 'health', 'compassionate', 'devices', 'sustainability'
    ]
  };

  const order = personaOrder[persona] || personaOrder.patient;
  
  return order
    .map(key => allItems[key])
    .filter(item => item && (!item.roles || item.roles.includes(persona)));
};

const supportItems: NavigationItem[] = [
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    description: 'App preferences',
    roles: ['patient', 'caregiver', 'provider']
  },
  {
    title: 'Help & Support',
    url: '/help',
    icon: HelpCircle,
    description: 'Get assistance',
    roles: ['patient', 'caregiver', 'provider']
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Get current persona from localStorage
  const currentPersona = localStorage.getItem('demoPersona') || 'patient';
  
  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-muted/70 transition-smooth";


  const filteredMainItems = getPersonaNavigationItems(currentPersona);
  const filteredSupportItems = supportItems.filter(item => 
    !item.roles || item.roles.includes(currentPersona)
  );

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
    >
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-accessible-base font-semibold text-primary">
            {collapsed ? "" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      title={item.description}
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col items-start">
                          <span className="text-accessible-base font-medium">
                            {item.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-accessible-base font-semibold text-muted-foreground">
            {collapsed ? "" : "Support"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      title={item.description}
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col items-start">
                          <span className="text-accessible-base font-medium">
                            {item.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Persona Indicator */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <UserPlus className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-accessible-sm font-medium capitalize text-primary">
                {currentPersona} View
              </p>
              <p className="text-xs text-muted-foreground">
                Demo Environment
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}