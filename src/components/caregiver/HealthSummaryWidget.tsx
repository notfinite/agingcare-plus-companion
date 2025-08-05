import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const HealthSummaryWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Health Summary</CardTitle>
        <CardDescription className="text-accessible-base">
          Overall health insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-accessible-base text-muted-foreground text-center py-8">
          Health summary coming soon...
        </p>
      </CardContent>
    </Card>
  );
};