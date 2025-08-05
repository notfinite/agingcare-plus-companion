import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const PatientsOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Patients Overview</CardTitle>
        <CardDescription className="text-accessible-base">
          Monitor your care recipients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-accessible-base text-muted-foreground text-center py-8">
          Patient management coming soon...
        </p>
      </CardContent>
    </Card>
  );
};