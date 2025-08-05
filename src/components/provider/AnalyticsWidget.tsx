import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AnalyticsWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Analytics</CardTitle>
        <CardDescription className="text-accessible-base">
          Patient outcomes and trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-accessible-base text-muted-foreground text-center py-8">
          Analytics dashboard coming soon...
        </p>
      </CardContent>
    </Card>
  );
};