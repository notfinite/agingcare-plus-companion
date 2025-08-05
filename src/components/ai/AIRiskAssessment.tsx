import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

export const AIRiskAssessment = () => {
  const riskFactors = [
    {
      factor: "Blood Pressure Trends",
      score: 85,
      status: "stable",
      trend: "improving",
      description: "BP readings show consistent improvement over 30 days",
      recommendation: "Continue current medication regimen"
    },
    {
      factor: "Medication Adherence",
      score: 92,
      status: "excellent",
      trend: "stable",
      description: "Consistent medication compliance with minor missed doses",
      recommendation: "Consider automated reminders for evening medications"
    },
    {
      factor: "Activity Levels",
      score: 68,
      status: "moderate",
      trend: "declining",
      description: "Daily steps decreased 15% in past 2 weeks",
      recommendation: "Gradual increase in physical activity recommended"
    },
    {
      factor: "Glucose Control",
      score: 76,
      status: "stable",
      trend: "stable",
      description: "HbA1c levels within target range with minor fluctuations",
      recommendation: "Maintain current diet and monitoring schedule"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-health-excellent";
      case "stable": return "text-health-good";
      case "moderate": return "text-health-warning";
      case "concerning": return "text-health-critical";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle className="h-4 w-4 text-health-excellent" />;
      case "stable": return <Activity className="h-4 w-4 text-health-good" />;
      case "moderate": return <AlertTriangle className="h-4 w-4 text-health-warning" />;
      case "concerning": return <AlertTriangle className="h-4 w-4 text-health-critical" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <TrendingUp className="h-4 w-4 text-health-excellent" />;
      case "declining": return <TrendingDown className="h-4 w-4 text-health-warning" />;
      case "stable": return <Activity className="h-4 w-4 text-health-good" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const overallRisk = 78; // Calculated from risk factors
  const getRiskLevel = (score: number) => {
    if (score >= 85) return { level: "Low", color: "text-health-excellent", bg: "bg-health-excellent/10" };
    if (score >= 70) return { level: "Moderate", color: "text-health-good", bg: "bg-health-good/10" };
    if (score >= 50) return { level: "Elevated", color: "text-health-warning", bg: "bg-health-warning/10" };
    return { level: "High", color: "text-health-critical", bg: "bg-health-critical/10" };
  };

  const riskLevel = getRiskLevel(overallRisk);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-accessible-2xl font-bold mb-2">AI Health Risk Assessment</h2>
        <p className="text-accessible-lg text-muted-foreground">
          Personalized insights powered by machine learning analysis
        </p>
      </div>

      {/* Overall Risk Score */}
      <Card className={`border-l-4 ${riskLevel.bg.replace('/10', '/30').replace('bg-', 'border-l-')}`}>
        <CardHeader>
          <CardTitle className="text-accessible-lg flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Overall Health Risk Score
          </CardTitle>
          <CardDescription>AI-powered assessment based on your health data patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className={`text-center p-6 rounded-lg ${riskLevel.bg}`}>
              <div className={`text-accessible-3xl font-bold ${riskLevel.color}`}>{overallRisk}</div>
              <div className={`text-accessible-base font-semibold ${riskLevel.color}`}>{riskLevel.level} Risk</div>
            </div>
            <div className="flex-1">
              <Progress value={overallRisk} className="h-3 mb-2" />
              <p className="text-accessible-base">
                Your health metrics show {riskLevel.level.toLowerCase()} risk for adverse events in the next 30 days.
                Continue monitoring key indicators and following care recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg">Risk Factor Analysis</CardTitle>
          <CardDescription>Detailed breakdown of factors affecting your health score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {riskFactors.map((factor, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-accessible-base font-semibold">{factor.factor}</h4>
                    {getStatusIcon(factor.status)}
                    {getTrendIcon(factor.trend)}
                  </div>
                  <div className="text-right">
                    <div className="text-accessible-lg font-bold">{factor.score}/100</div>
                    <Badge variant="outline" className={getStatusColor(factor.status)}>
                      {factor.status}
                    </Badge>
                  </div>
                </div>
                <Progress value={factor.score} className="h-2 mb-3" />
                <p className="text-accessible-sm text-muted-foreground mb-2">{factor.description}</p>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-accessible-sm">
                    <strong>Recommendation:</strong> {factor.recommendation}
                  </AlertDescription>
                </Alert>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg">30-Day Health Predictions</CardTitle>
          <CardDescription>AI-generated forecasts based on current trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-health-excellent/10 rounded-lg">
              <CheckCircle className="h-8 w-8 text-health-excellent mx-auto mb-2" />
              <div className="text-accessible-lg font-bold text-health-excellent">87%</div>
              <p className="text-accessible-base font-medium">Medication Adherence</p>
              <p className="text-accessible-sm text-muted-foreground">Predicted compliance rate</p>
            </div>
            <div className="text-center p-4 bg-health-good/10 rounded-lg">
              <TrendingUp className="h-8 w-8 text-health-good mx-auto mb-2" />
              <div className="text-accessible-lg font-bold text-health-good">5%</div>
              <p className="text-accessible-base font-medium">BP Improvement</p>
              <p className="text-accessible-sm text-muted-foreground">Expected reduction</p>
            </div>
            <div className="text-center p-4 bg-health-warning/10 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-health-warning mx-auto mb-2" />
              <div className="text-accessible-lg font-bold text-health-warning">12%</div>
              <p className="text-accessible-base font-medium">Alert Probability</p>
              <p className="text-accessible-sm text-muted-foreground">Risk of health event</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg">Recommended Actions</CardTitle>
          <CardDescription>AI-suggested steps to improve your health outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="text-accessible-base font-medium">Increase daily walking by 500 steps</p>
                <p className="text-accessible-sm text-muted-foreground">Predicted to improve cardiovascular score by 8%</p>
              </div>
              <Button size="sm">Set Goal</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="text-accessible-base font-medium">Schedule medication review with provider</p>
                <p className="text-accessible-sm text-muted-foreground">Optimize timing for better adherence</p>
              </div>
              <Button size="sm">Schedule</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="text-accessible-base font-medium">Enable evening medication reminders</p>
                <p className="text-accessible-sm text-muted-foreground">Reduce missed doses by an estimated 15%</p>
              </div>
              <Button size="sm">Enable</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};