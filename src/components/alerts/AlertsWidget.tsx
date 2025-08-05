import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, CheckCircle, Bell, X, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  alert_type: string;
  is_read: boolean;
  created_at: string;
  expires_at?: string;
  data?: any;
}

export const AlertsWidget = () => {
  const { profile } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchAlerts();
    }
  }, [profile]);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('patient_id', profile?.id)
        .is('expires_at', null)
        .or('expires_at.gt.' + new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAlerts((data as Alert[]) || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
      
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-health-critical border-health-critical';
      case 'high':
        return 'text-health-warning border-health-warning';
      case 'medium':
        return 'text-health-caution border-health-caution';
      case 'low':
        return 'text-health-good border-health-good';
      default:
        return 'text-muted-foreground border-muted';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-5 w-5" />;
      case 'medium':
        return <Bell className="h-5 w-5" />;
      case 'low':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'medication_reminder':
        return 'Medication';
      case 'vital_alert':
        return 'Vital Signs';
      case 'appointment_reminder':
        return 'Appointment';
      case 'health_trend':
        return 'Health Trend';
      case 'emergency':
        return 'Emergency';
      case 'system':
        return 'System';
      default:
        return type;
    }
  };

  const unreadCount = alerts.filter(alert => !alert.is_read).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg">Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading alerts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-accessible-lg flex items-center space-x-2">
              <span>Alerts & Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-accessible-base">
              Important health alerts and reminders
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-accessible-base text-muted-foreground text-center py-8">
              No alerts at this time. We'll notify you when something needs your attention.
            </p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg transition-all ${
                  alert.is_read ? 'bg-muted/30' : 'bg-card border-l-4'
                } ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`mt-1 ${getSeverityColor(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-accessible-base font-medium">
                          {alert.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {getAlertTypeLabel(alert.alert_type)}
                        </Badge>
                      </div>
                      <p className="text-accessible-sm text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!alert.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {unreadCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => alerts.forEach(alert => !alert.is_read && markAsRead(alert.id))}
            >
              Mark All as Read
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};