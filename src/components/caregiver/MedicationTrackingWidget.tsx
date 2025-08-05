import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const MedicationTrackingWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Medication Tracking</CardTitle>
        <CardDescription className="text-accessible-base">
          Monitor medication compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-accessible-base text-muted-foreground text-center py-8">
          Medication tracking coming soon...
        </p>
      </CardContent>
    </Card>
  );
};