import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Watch, Activity, Heart, Droplets, Thermometer, Wifi, WifiOff, CheckCircle, AlertTriangle } from 'lucide-react';

export const DeviceIntegration = () => {
  const connectedDevices = [
    {
      name: "Apple Watch Series 9",
      type: "Smartwatch",
      status: "connected",
      lastSync: "2 minutes ago",
      metrics: ["Heart Rate", "Activity", "Sleep"],
      battery: 85,
      icon: <Watch className="h-5 w-5" />
    },
    {
      name: "Omron Blood Pressure Monitor",
      type: "BP Monitor",
      status: "connected",
      lastSync: "1 hour ago",
      metrics: ["Blood Pressure", "Pulse"],
      battery: 78,
      icon: <Heart className="h-5 w-5" />
    },
    {
      name: "FreeStyle Libre 3",
      type: "CGM",
      status: "connected",
      lastSync: "15 minutes ago",
      metrics: ["Blood Glucose", "Trends"],
      battery: 92,
      icon: <Droplets className="h-5 w-5" />
    },
    {
      name: "iPhone Health App",
      type: "Health Platform",
      status: "connected",
      lastSync: "5 minutes ago",
      metrics: ["Steps", "Weight", "Sleep"],
      battery: null,
      icon: <Smartphone className="h-5 w-5" />
    }
  ];

  const availableDevices = [
    {
      name: "Fitbit Charge 6",
      type: "Fitness Tracker",
      compatibility: "Compatible",
      features: ["Heart Rate", "Activity", "Sleep", "Stress"]
    },
    {
      name: "Withings Scale",
      type: "Smart Scale",
      compatibility: "Compatible",
      features: ["Weight", "BMI", "Body Fat", "Muscle Mass"]
    },
    {
      name: "ResMed AirSense 11",
      type: "CPAP Machine",
      compatibility: "FHIR Compatible",
      features: ["Sleep Quality", "AHI", "Compliance"]
    }
  ];

  const recentReadings = [
    {
      device: "Apple Watch",
      metric: "Heart Rate",
      value: "68 BPM",
      time: "2 min ago",
      status: "normal",
      icon: <Heart className="h-4 w-4" />
    },
    {
      device: "BP Monitor",
      metric: "Blood Pressure",
      value: "122/78 mmHg",
      time: "1 hour ago",
      status: "good",
      icon: <Activity className="h-4 w-4" />
    },
    {
      device: "CGM",
      metric: "Blood Glucose",
      value: "145 mg/dL",
      time: "15 min ago",
      status: "elevated",
      icon: <Droplets className="h-4 w-4" />
    },
    {
      device: "Smart Thermometer",
      metric: "Body Temperature",
      value: "98.6°F",
      time: "This morning",
      status: "normal",
      icon: <Thermometer className="h-4 w-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "text-health-excellent";
      case "syncing": return "text-health-warning";
      case "offline": return "text-health-critical";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <Wifi className="h-4 w-4 text-health-excellent" />;
      case "syncing": return <Activity className="h-4 w-4 text-health-warning animate-pulse" />;
      case "offline": return <WifiOff className="h-4 w-4 text-health-critical" />;
      default: return <WifiOff className="h-4 w-4" />;
    }
  };

  const getReadingStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-health-excellent";
      case "good": return "text-health-good";
      case "elevated": return "text-health-warning";
      case "high": return "text-health-critical";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-accessible-2xl font-bold mb-2">Connected Health Devices</h2>
        <p className="text-accessible-lg text-muted-foreground">
          Seamlessly track your health with integrated medical devices
        </p>
      </div>

      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            Your Connected Devices
          </CardTitle>
          <CardDescription>Manage your health monitoring devices and data sync</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedDevices.map((device, index) => (
              <Card key={index} className="border-l-4 border-l-health-excellent">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {device.icon}
                      <CardTitle className="text-accessible-base">{device.name}</CardTitle>
                    </div>
                    {getStatusIcon(device.status)}
                  </div>
                  <Badge variant="outline">{device.type}</Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-accessible-sm">Status</span>
                      <span className={`text-accessible-sm font-semibold ${getStatusColor(device.status)}`}>
                        {device.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-accessible-sm">Last Sync</span>
                      <span className="text-accessible-sm text-muted-foreground">{device.lastSync}</span>
                    </div>
                    {device.battery && (
                      <div className="flex justify-between items-center">
                        <span className="text-accessible-sm">Battery</span>
                        <span className="text-accessible-sm">{device.battery}%</span>
                      </div>
                    )}
                    <div>
                      <span className="text-accessible-sm font-medium">Metrics:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {device.metrics.map((metric, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{metric}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-accessible-sm">Auto-sync</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Readings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg">Recent Device Readings</CardTitle>
          <CardDescription>Latest data from your connected health devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReadings.map((reading, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {reading.icon}
                  <div>
                    <p className="text-accessible-base font-medium">{reading.metric}</p>
                    <p className="text-accessible-sm text-muted-foreground">from {reading.device}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-accessible-base font-semibold ${getReadingStatusColor(reading.status)}`}>
                    {reading.value}
                  </p>
                  <p className="text-accessible-sm text-muted-foreground">{reading.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg">Add More Devices</CardTitle>
          <CardDescription>Expand your health monitoring with compatible devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableDevices.map((device, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-accessible-base">{device.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{device.type}</Badge>
                    <Badge variant="secondary" className="text-xs">{device.compatibility}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <span className="text-accessible-sm font-medium">Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {device.features.map((feature, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Connect Device
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FHIR Integration Notice */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="text-accessible-base">
          <strong>FHIR Integration Active:</strong> Your device data is automatically synchronized with your 
          healthcare provider's system using secure FHIR standards, ensuring seamless care coordination.
        </AlertDescription>
      </Alert>

      {/* Apple HealthKit Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg">Apple HealthKit Integration</CardTitle>
          <CardDescription>Centralized health data management through Apple Health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-accessible-base font-medium">Apple Health Sync</p>
                  <p className="text-accessible-sm text-muted-foreground">
                    Automatically import data from Apple Health app
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-health-excellent" />
                <Switch defaultChecked />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-accessible-lg font-bold text-primary">12,847</div>
                <p className="text-accessible-sm">Steps Today</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-accessible-lg font-bold text-secondary">7.2 hrs</div>
                <p className="text-accessible-sm">Sleep Last Night</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-accessible-lg font-bold text-health-good">68 BPM</div>
                <p className="text-accessible-sm">Resting HR</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-accessible-lg font-bold text-health-excellent">892</div>
                <p className="text-accessible-sm">Active Calories</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};