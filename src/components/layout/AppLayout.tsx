import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Bell, Menu, Settings, LogOut, ArrowLeft, Search } from 'lucide-react';
import { EmergencyFloatingButton } from './EmergencyFloatingButton';
import { QuickActionsBar } from './QuickActionsBar';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Get current persona for quick actions
  const currentPersona = localStorage.getItem('demoPersona') || 'patient';

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full flex">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SidebarTrigger className="mr-2" />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/')}
                  className="mr-2 hover-scale"
                  aria-label="Return to home"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Home
                </Button>
                <Heart className="h-8 w-8 text-primary" />
                <h1 className="text-accessible-xl font-bold text-primary">AgingCare+</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="hover-scale"
                  aria-label="Global search"
                >
                  <Search className="h-6 w-6" />
                </Button>
                
                
                
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <span className="text-accessible-base">{profile?.full_name || 'Demo User'}</span>
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center space-x-2 text-destructive"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          
          {/* Quick Actions Bar */}
          <QuickActionsBar persona={currentPersona} />
          
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
        
        {/* Emergency Floating Button */}
        <EmergencyFloatingButton />
        
        <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </SidebarProvider>
  );
};