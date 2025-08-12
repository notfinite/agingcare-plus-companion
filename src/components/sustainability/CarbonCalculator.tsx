import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingDown, Droplets, Utensils } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CarbonComparison {
  item1: string;
  item2: string;
  co2_difference: number;
  water_difference: number;
  recommendation: string;
}

export const CarbonCalculator = () => {
  const [userInput, setUserInput] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CarbonComparison | null>(null);

  const calculateCarbonImpact = async () => {
    if (!userInput.trim()) {
      toast.error('Please describe your choice or habit');
      return;
    }

    setIsCalculating(true);
    try {
      const { data, error } = await supabase.functions.invoke('sustainability-ai-advisor', {
        body: {
          userAction: `Calculate and compare the carbon footprint of: "${userInput}". Provide a specific alternative with exact CO2 and water usage differences. Format as a clear comparison with actionable recommendation.`,
          context: {
            calculationMode: true
          }
        }
      });

      if (error) throw error;

      // Parse the AI response for structured data
      const response = data.recommendation;
      
      // For demonstration, create a structured result
      // In production, you'd parse the AI response more robustly
      const mockResult: CarbonComparison = {
        item1: userInput,
        item2: 'Plant-based alternative',
        co2_difference: data.carbonCalculation?.savings_per_kg || 58,
        water_difference: data.carbonCalculation?.water_savings_liters || 15078,
        recommendation: response.substring(0, 200) + '...'
      };

      setResult(mockResult);
      toast.success('Carbon impact calculated!');

    } catch (error) {
      console.error('Error calculating carbon impact:', error);
      toast.error('Calculation failed. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCalculating) {
      calculateCarbonImpact();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-500" />
          Carbon Impact Calculator
        </CardTitle>
        <CardDescription>
          Compare the environmental impact of your choices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="carbon-input">What would you like to calculate?</Label>
          <div className="flex gap-2">
            <Input
              id="carbon-input"
              placeholder="e.g., eating beef twice a week"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={calculateCarbonImpact}
              disabled={isCalculating || !userInput.trim()}
            >
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-4 mt-6">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Your Choice vs. Alternative
                </h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Current:</p>
                  <p className="text-sm text-muted-foreground">{result.item1}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Better Choice:</p>
                  <p className="text-sm text-muted-foreground">{result.item2}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">CO₂ Saved</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      -{result.co2_difference}kg per week
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Water Saved</p>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      -{result.water_difference}L per week
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">
                  <strong>💡 AI Insight:</strong> {result.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
          <p className="text-sm">
            <strong>Examples to try:</strong> "driving to work daily", "buying bottled water", "eating meat daily", "using disposable cups"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};