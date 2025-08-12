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
  Leaf
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

const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    description: 'Main overview',
    roles: ['patient', 'caregiver', 'provider']
  },
  {
    title: 'Health Metrics',
    url: '/health',
    icon: Heart,
    description: 'Vital signs and trends',
    roles: ['patient', 'caregiver', 'provider']
  },
  {
    title: 'Appointments',
    url: '/appointments',
    icon: Calendar,
    description: 'Schedule management',
    roles: ['patient', 'caregiver', 'provider']
  },
  {
    title: 'Telehealth',
    url: '/telehealth',
    icon: Stethoscope,
    description: 'Virtual consultations',
    roles: ['patient', 'caregiver', 'provider']
  },
  {
    title: 'Community',
    url: '/community',
    icon: MessageSquare,
    description: 'Support network',
    roles: ['patient', 'caregiver']
  },
  {
    title: 'AI Assessment',
    url: '/ai-assessment',
    icon: Brain,
    description: 'Risk evaluation',
    roles: ['patient', 'caregiver', 'provider']
  },
  {
    title: 'Devices',
    url: '/devices',
    icon: Activity,
    description: 'Connected health devices',
    roles: ['patient', 'caregiver', 'provider']
  },
  {
    title: 'Sustainability',
    url: '/sustainability',
    icon: Leaf,
    description: 'Green health choices',
    roles: ['patient', 'caregiver', 'provider']
  },
  {
    title: 'Patients',
    url: '/patients',
    icon: Users,
    description: 'Patient management',
    roles: ['caregiver', 'provider']
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
    description: 'Health insights',
    roles: ['provider']
  }
];

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

  const filterItemsByRole = (items: NavigationItem[]) => 
    items.filter(item => !item.roles || item.roles.includes(currentPersona));

  const filteredMainItems = filterItemsByRole(navigationItems);
  const filteredSupportItems = filterItemsByRole(supportItems);

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