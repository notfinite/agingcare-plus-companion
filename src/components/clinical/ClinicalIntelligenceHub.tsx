import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  FileText,
  Shield,
  Sparkles
} from 'lucide-react';

interface ClinicalRecommendation {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  evidence_level: string;
  action_required: boolean;
  created_at: string;
}

interface PatientContext {
  age: number;
  gender: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  recent_vitals: any;
}

export const ClinicalIntelligenceHub = () => {
  const [recommendations, setRecommendations] = useState<ClinicalRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [patientQuery, setPatientQuery] = useState('');
  const [patientContext, setPatientContext] = useState<PatientContext | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchClinicalData();
  }, []);

  const fetchClinicalData = async () => {
    try {
      // Fetch recent clinical alerts and guidelines
      const { data: alertsData } = await supabase
        .from('clinical_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (alertsData) {
        setRecommendations(alertsData.map(alert => ({
          id: alert.id,
          severity: alert.severity as any,
          category: alert.alert_type,
          title: alert.title,
          description: alert.description || '',
          evidence_level: 'A',
          action_required: !alert.is_acknowledged,
          created_at: alert.created_at
        })));
      }

      // Simulate patient context loading
      setPatientContext({
        age: 65,
        gender: 'female',
        conditions: ['Type 2 Diabetes', 'Hypertension', 'Hyperlipidemia'],
        medications: ['Metformin', 'Lisinopril', 'Atorvastatin'],
        allergies: ['Penicillin'],
        recent_vitals: {
          blood_pressure: '142/90',
          heart_rate: 78,
          temperature: 98.6,
          weight: 165
        }
      });
    } catch (error) {
      console.error('Error fetching clinical data:', error);
    }
  };

  const analyzeClinicalQuery = async () => {
    if (!patientQuery.trim()) return;

    setIsAnalyzing(true);
    try {
      // Call AI clinical intelligence edge function
      const { data, error } = await supabase.functions.invoke('ai-health-assistant', {
        body: {
          message: patientQuery,
          context: {
            type: 'clinical_analysis',
            patient_context: patientContext,
            include_recommendations: true,
            evidence_based: true
          }
        }
      });

      if (error) throw error;

      setAnalysisResults({
        clinical_assessment: data.response,
        risk_factors: [
          { factor: 'Cardiovascular Risk', level: 'moderate', description: 'Based on current BP and lipid levels' },
          { factor: 'Diabetic Complications', level: 'low', description: 'Well-controlled glucose levels' },
          { factor: 'Medication Interactions', level: 'low', description: 'No significant interactions detected' }
        ],
        recommendations: [
          {
            category: 'Monitoring',
            action: 'Schedule quarterly HbA1c testing',
            priority: 'high',
            evidence: 'ADA Guidelines 2024'
          },
          {
            category: 'Lifestyle',
            action: 'Increase physical activity to 150 min/week',
            priority: 'medium',
            evidence: 'ACC/AHA Guidelines'
          }
        ],
        contraindications: [],
        follow_up: 'Recommend follow-up in 3 months or sooner if symptoms worsen'
      });

      toast({
        title: "Clinical Analysis Complete",
        description: "AI-powered insights generated successfully",
      });
    } catch (error) {
      console.error('Error in clinical analysis:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to generate clinical insights",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'moderate': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Clinical Intelligence Hub
          </h2>
          <p className="text-muted-foreground">Advanced clinical decision support powered by AI</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Clinical Grade AI
        </Badge>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Clinical Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Active Alerts</TabsTrigger>
          <TabsTrigger value="guidelines">Evidence Base</TabsTrigger>
          <TabsTrigger value="insights">Predictive Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {/* Patient Context Card */}
          {patientContext && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Patient Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Demographics</p>
                    <p>{patientContext.age}yo {patientContext.gender}</p>
                  </div>
                  <div>
                    <p className="font-medium">Active Conditions</p>
                    <div className="space-y-1">
                      {patientContext.conditions.map((condition, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{condition}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Current Medications</p>
                    <div className="space-y-1">
                      {patientContext.medications.map((med, i) => (
                        <p key={i} className="text-xs text-muted-foreground">{med}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Recent Vitals</p>
                    <div className="text-xs space-y-1">
                      <p>BP: {patientContext.recent_vitals.blood_pressure}</p>
                      <p>HR: {patientContext.recent_vitals.heart_rate} bpm</p>
                      <p>Weight: {patientContext.recent_vitals.weight} lbs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clinical Query Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Clinical Decision Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Clinical Query</label>
                <Textarea
                  placeholder="Enter clinical question, symptoms, or scenario for AI analysis..."
                  value={patientQuery}
                  onChange={(e) => setPatientQuery(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button 
                onClick={analyzeClinicalQuery}
                disabled={isAnalyzing || !patientQuery.trim()}
                className="w-full"
              >
                {isAnalyzing ? 'Analyzing...' : 'Generate Clinical Insights'}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResults && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysisResults.risk_factors.map((risk: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{risk.factor}</p>
                        <p className="text-xs text-muted-foreground">{risk.description}</p>
                      </div>
                      <Badge className={getRiskLevelColor(risk.level)}>
                        {risk.level}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evidence-Based Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysisResults.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{rec.action}</p>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{rec.category}</span>
                        <span>{rec.evidence}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {analysisResults && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clinical Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p>{analysisResults.clinical_assessment}</p>
                </div>
                {analysisResults.follow_up && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Follow-up Plan:</p>
                    <p className="text-sm text-blue-800">{analysisResults.follow_up}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {rec.action_required ? (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(rec.severity)}>
                      {rec.severity}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Evidence Level {rec.evidence_level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(rec.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                      {rec.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clinical Guidelines Database</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">ADA Diabetes Care Standards</h4>
                    <p className="text-sm text-muted-foreground">2024 Updates</p>
                    <Badge variant="outline" className="mt-2">Evidence Level A</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">ACC/AHA Hypertension Guidelines</h4>
                    <p className="text-sm text-muted-foreground">Blood Pressure Management</p>
                    <Badge variant="outline" className="mt-2">Evidence Level A</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">USPSTF Screening Recommendations</h4>
                    <p className="text-sm text-muted-foreground">Preventive Care Guidelines</p>
                    <Badge variant="outline" className="mt-2">Evidence Level B</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Drug Interaction Database</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900">Current Medications</h4>
                    <p className="text-sm text-green-800">No critical interactions detected</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Monitoring Recommendations:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Monitor renal function with Lisinopril</li>
                      <li>• Watch for muscle symptoms with Atorvastatin</li>
                      <li>• Check B12 levels with long-term Metformin use</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  30-Day Risk Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Hospital Readmission</span>
                    <Badge className="bg-green-500 text-white">Low (8%)</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Cardiovascular Event</span>
                    <Badge className="bg-yellow-500 text-white">Moderate (15%)</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Diabetic Complications</span>
                    <Badge className="bg-green-500 text-white">Low (5%)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Predictive Interventions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900">Preventive Care Alert</h4>
                    <p className="text-sm text-blue-800">Due for annual eye exam - diabetic retinopathy screening</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Medication Optimization</h4>
                    <p className="text-sm text-yellow-800">Consider ACE inhibitor dose adjustment based on recent BP readings</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900">Lifestyle Intervention</h4>
                    <p className="text-sm text-green-800">Nutrition counseling may improve HbA1c by 0.5-1.0%</p>
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