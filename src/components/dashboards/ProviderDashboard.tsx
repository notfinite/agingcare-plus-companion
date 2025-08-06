import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PatientListWidget } from '@/components/provider/PatientListWidget';
import { AppointmentsWidget } from '@/components/appointments/AppointmentsWidget';
import { ClinicalAlertsWidget } from '@/components/provider/ClinicalAlertsWidget';
import { AnalyticsWidget } from '@/components/provider/AnalyticsWidget';
import { TelehealthWidget } from '@/components/telehealth/TelehealthWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, Video, AlertTriangle, Activity, Heart, DollarSign, Award, CheckCircle, BarChart3 } from 'lucide-react';

export const ProviderDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-accessible-2xl font-bold mb-2">Provider Dashboard</h2>
          <p className="text-accessible-lg text-muted-foreground">
            Comprehensive patient care management and clinical insights
          </p>
        </div>

        {/* Population Health Metrics - 1000+ Patients */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-premium hover-lift bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Patient Panel</CardTitle>
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-primary">1,247</div>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-primary" />
                <p className="text-accessible-sm text-primary font-medium">Active chronic patients</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +47 new this month (↑3.9%)
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift bg-gradient-to-br from-health-warning/10 to-health-warning/5 border-health-warning/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Risk Stratification</CardTitle>
              <div className="p-2 bg-health-warning/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-health-warning" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-health-warning">23%</div>
              <div className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3 text-health-warning" />
                <p className="text-accessible-sm text-health-warning font-medium">High-risk patients</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                287 need intervention (-5% vs last month)
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift bg-gradient-to-br from-health-excellent/10 to-health-excellent/5 border-health-excellent/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Quality Metrics</CardTitle>
              <div className="p-2 bg-health-excellent/20 rounded-lg">
                <Award className="h-5 w-5 text-health-excellent" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-health-excellent">91.2%</div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-health-excellent" />
                <p className="text-accessible-sm text-health-excellent font-medium">Care quality score</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Above national avg (87%)
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Cost Efficiency</CardTitle>
              <div className="p-2 bg-secondary/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-secondary">$1.2M</div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-secondary" />
                <p className="text-accessible-sm text-secondary font-medium">Savings this year</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                From preventive care (+18% efficiency)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chronic Disease Distribution & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-accessible-lg">Chronic Disease Distribution</CardTitle>
              <CardDescription>1,247 patients across conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-accessible-base">Type 2 Diabetes</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-health-warning h-2 rounded-full" style={{width: '38%'}}></div>
                    </div>
                    <span className="text-accessible-sm font-semibold">474 (38%)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accessible-base">Hypertension</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-health-critical h-2 rounded-full" style={{width: '31%'}}></div>
                    </div>
                    <span className="text-accessible-sm font-semibold">387 (31%)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accessible-base">Heart Disease</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{width: '22%'}}></div>
                    </div>
                    <span className="text-accessible-sm font-semibold">274 (22%)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accessible-base">COPD</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: '18%'}}></div>
                    </div>
                    <span className="text-accessible-sm font-semibold">224 (18%)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accessible-base">CKD</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-health-good h-2 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    <span className="text-accessible-sm font-semibold">187 (15%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-accessible-lg">Actionable Insights</CardTitle>
              <CardDescription>Priority interventions this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-health-warning/10 border border-health-warning/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-health-warning" />
                    <span className="font-semibold text-health-warning">High Priority</span>
                  </div>
                  <p className="text-accessible-sm">42 diabetes patients with HbA1c &gt;9%. Schedule intensive management.</p>
                </div>
                <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-secondary" />
                    <span className="font-semibold text-secondary">Preventive Care</span>
                  </div>
                  <p className="text-accessible-sm">156 patients due for annual wellness visits. Outreach campaign needed.</p>
                </div>
                <div className="p-3 bg-health-excellent/10 border border-health-excellent/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-health-excellent" />
                    <span className="font-semibold text-health-excellent">Success Story</span>
                  </div>
                  <p className="text-accessible-sm">78% of heart failure patients showing improved ejection fraction.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PatientListWidget />
          <ClinicalAlertsWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TelehealthWidget />
          <AnalyticsWidget />
        </div>

        <AppointmentsWidget />
      </div>
    </AppLayout>
  );
};