import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthMetricsWidget } from '@/components/health/HealthMetricsWidget';
import { VitalsChart } from '@/components/health/VitalsChart';
import { SmartMedicationReminder } from '@/components/medication/SmartMedicationReminder';
import { MedicationWidget } from '@/components/medication/MedicationWidget';
import { RealTimeChat } from '@/components/communication/RealTimeChat';
import { InsuranceManager } from '@/components/insurance/InsuranceManager';
import { PatientEducationHub } from '@/components/education/PatientEducationHub';
import { EnhancedEmergencySystem } from '@/components/emergency/EnhancedEmergencySystem';
import { Heart, Activity, Pill, MessageSquare, CreditCard, BookOpen, Shield } from 'lucide-react';

const Health = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Health Management</h1>
          <p className="text-muted-foreground">
            Comprehensive health tracking, medication management, and care coordination
          </p>
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="vitals" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Vitals
            </TabsTrigger>
            <TabsTrigger value="medication" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medication
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Insurance
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Emergency
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HealthMetricsWidget />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Health Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">92</div>
                        <div className="text-sm text-green-700">Health Score</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">8.5</div>
                        <div className="text-sm text-blue-700">Wellness Index</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Your health metrics are trending positively. Keep up the great work with regular monitoring and healthy habits.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <VitalsChart />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Blood Pressure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">120/80</div>
                  <div className="text-sm text-green-600">Normal Range</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Heart Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72 BPM</div>
                  <div className="text-sm text-green-600">Resting Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">165 lbs</div>
                  <div className="text-sm text-blue-600">Target Range</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MedicationWidget />
              <SmartMedicationReminder />
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <RealTimeChat />
          </TabsContent>

          <TabsContent value="insurance" className="space-y-6">
            <InsuranceManager />
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <PatientEducationHub />
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <EnhancedEmergencySystem />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Health;