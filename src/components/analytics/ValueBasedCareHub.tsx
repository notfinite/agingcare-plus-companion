import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award,
  DollarSign,
  Users,
  Heart,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface QualityMetric {
  id: string;
  name: string;
  category: string;
  current_value: number;
  target_value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  last_updated: string;
  risk_level: 'low' | 'medium' | 'high';
}

interface OutcomeData {
  id: string;
  patient_id: string;
  metric_name: string;
  baseline_value: number;
  current_value: number;
  improvement_percentage: number;
  measurement_date: string;
}

interface CostMetric {
  category: string;
  current_spend: number;
  budgeted_spend: number;
  savings_achieved: number;
  roi_percentage: number;
}

export const ValueBasedCareHub = () => {
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  const [outcomeData, setOutcomeData] = useState<OutcomeData[]>([]);
  const [costMetrics, setCostMetrics] = useState<CostMetric[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchValueBasedData();
  }, [selectedTimeframe]);

  const fetchValueBasedData = async () => {
    try {
      setLoading(true);
      
      // Simulate quality metrics data
      setQualityMetrics([
        {
          id: '1',
          name: 'Medication Adherence Rate',
          category: 'Clinical Quality',
          current_value: 87.5,
          target_value: 90,
          unit: '%',
          trend: 'up',
          last_updated: new Date().toISOString(),
          risk_level: 'medium'
        },
        {
          id: '2',
          name: 'Hospital Readmission Rate',
          category: 'Patient Safety',
          current_value: 8.2,
          target_value: 10,
          unit: '%',
          trend: 'down',
          last_updated: new Date().toISOString(),
          risk_level: 'low'
        },
        {
          id: '3',
          name: 'Patient Satisfaction Score',
          category: 'Patient Experience',
          current_value: 4.6,
          target_value: 4.5,
          unit: '/5',
          trend: 'up',
          last_updated: new Date().toISOString(),
          risk_level: 'low'
        },
        {
          id: '4',
          name: 'HbA1c Control Rate',
          category: 'Chronic Disease Management',
          current_value: 78.3,
          target_value: 80,
          unit: '%',
          trend: 'stable',
          last_updated: new Date().toISOString(),
          risk_level: 'medium'
        },
        {
          id: '5',
          name: 'Preventive Care Completion',
          category: 'Preventive Care',
          current_value: 92.1,
          target_value: 95,
          unit: '%',
          trend: 'up',
          last_updated: new Date().toISOString(),
          risk_level: 'low'
        }
      ]);

      // Simulate outcome data
      setOutcomeData([
        {
          id: '1',
          patient_id: 'P001',
          metric_name: 'Blood Pressure Control',
          baseline_value: 152,
          current_value: 138,
          improvement_percentage: 9.2,
          measurement_date: new Date().toISOString()
        },
        {
          id: '2',
          patient_id: 'P002',
          metric_name: 'HbA1c Level',
          baseline_value: 8.9,
          current_value: 7.1,
          improvement_percentage: 20.2,
          measurement_date: new Date().toISOString()
        },
        {
          id: '3',
          patient_id: 'P003',
          metric_name: 'LDL Cholesterol',
          baseline_value: 165,
          current_value: 98,
          improvement_percentage: 40.6,
          measurement_date: new Date().toISOString()
        }
      ]);

      // Simulate cost metrics
      setCostMetrics([
        {
          category: 'Emergency Department',
          current_spend: 145000,
          budgeted_spend: 180000,
          savings_achieved: 35000,
          roi_percentage: 19.4
        },
        {
          category: 'Hospital Admissions',
          current_spend: 890000,
          budgeted_spend: 1200000,
          savings_achieved: 310000,
          roi_percentage: 25.8
        },
        {
          category: 'Prescription Drugs',
          current_spend: 320000,
          budgeted_spend: 350000,
          savings_achieved: 30000,
          roi_percentage: 8.6
        },
        {
          category: 'Preventive Care',
          current_spend: 75000,
          budgeted_spend: 65000,
          savings_achieved: -10000,
          roi_percentage: -15.4
        }
      ]);

    } catch (error) {
      console.error('Error fetching value-based care data:', error);
      toast({
        title: "Error",
        description: "Failed to load value-based care data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-200 text-green-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading value-based care metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Value-Based Care Dashboard
          </h2>
          <p className="text-muted-foreground">Outcome tracking and quality reporting for value-based contracts</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
              <SelectItem value="180">6 Months</SelectItem>
              <SelectItem value="365">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({ title: "Export", description: "Report exported successfully" })}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quality Score</p>
                <p className="text-2xl font-bold">4.2/5.0</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +0.3 from last quarter
                </p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Savings</p>
                <p className="text-2xl font-bold">$365K</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  18% better than target
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patient Outcomes</p>
                <p className="text-2xl font-bold">23.4%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  Average improvement
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                <p className="text-2xl font-bold">Low</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  All targets met
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="quality" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="outcomes">Patient Outcomes</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Targets</TabsTrigger>
        </TabsList>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid gap-4">
            {qualityMetrics.map((metric) => (
              <Card key={metric.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{metric.name}</h4>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <p className="text-sm text-muted-foreground">{metric.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {metric.current_value}{metric.unit}
                        </span>
                        <Badge className={getRiskColor(metric.risk_level)}>
                          {metric.risk_level} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Target: {metric.target_value}{metric.unit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Target</span>
                      <span>{Math.round(calculateProgress(metric.current_value, metric.target_value))}%</span>
                    </div>
                    <Progress 
                      value={calculateProgress(metric.current_value, metric.target_value)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                    <span>Last updated: {new Date(metric.last_updated).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Individual Patient Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {outcomeData.map((outcome) => (
                    <div key={outcome.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{outcome.metric_name}</h4>
                          <p className="text-xs text-muted-foreground">Patient {outcome.patient_id}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          +{outcome.improvement_percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Baseline</p>
                          <p className="font-medium">{outcome.baseline_value}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-medium">{outcome.current_value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Population Health Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-green-900">Diabetes Management</span>
                      <span className="text-green-600 font-bold">+15.2%</span>
                    </div>
                    <p className="text-sm text-green-700">HbA1c targets achieved</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-900">Hypertension Control</span>
                      <span className="text-blue-600 font-bold">+12.8%</span>
                    </div>
                    <p className="text-sm text-blue-700">Blood pressure targets met</p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-purple-900">Preventive Screening</span>
                      <span className="text-purple-600 font-bold">+8.4%</span>
                    </div>
                    <p className="text-sm text-purple-700">Completion rates improved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cost" className="space-y-4">
          <div className="grid gap-4">
            {costMetrics.map((cost, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{cost.category}</h4>
                      <p className="text-sm text-muted-foreground">Cost management performance</p>
                    </div>
                    <Badge className={cost.savings_achieved > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      ROI: {cost.roi_percentage > 0 ? '+' : ''}{cost.roi_percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Spend</p>
                      <p className="font-bold text-lg">{formatCurrency(cost.current_spend)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">{formatCurrency(cost.budgeted_spend)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Savings</p>
                      <p className={`font-bold ${cost.savings_achieved > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {cost.savings_achieved > 0 ? '+' : ''}{formatCurrency(cost.savings_achieved)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget Utilization</span>
                      <span>{((cost.current_spend / cost.budgeted_spend) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(cost.current_spend / cost.budgeted_spend) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Quality Bonus Eligible</span>
                    <Badge className="bg-green-100 text-green-800">Yes</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Shared Savings</span>
                    <Badge className="bg-blue-100 text-blue-800">$125K</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Risk Score</span>
                    <Badge className="bg-yellow-100 text-yellow-800">0.92</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Star Rating</span>
                    <Badge className="bg-purple-100 text-purple-800">4.2 ⭐</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">Q4 Quality Review</h4>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Due: December 31, 2024</p>
                    <Progress value={75} className="h-2 mt-2" />
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">Annual Contract Renewal</h4>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Due: March 15, 2025</p>
                    <Progress value={40} className="h-2 mt-2" />
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">HEDIS Reporting</h4>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Due: February 28, 2025</p>
                    <Progress value={90} className="h-2 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};