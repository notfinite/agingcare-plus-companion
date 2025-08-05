import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ClinicalAlertsWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Clinical Alerts</CardTitle>
        <CardDescription className="text-accessible-base">
          Critical patient notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-accessible-base text-muted-foreground text-center py-8">
          Clinical alerts coming soon...
        </p>
      </CardContent>
    </Card>
  );
};