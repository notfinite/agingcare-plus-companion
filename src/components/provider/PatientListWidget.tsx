import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const PatientListWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Patient List</CardTitle>
        <CardDescription className="text-accessible-base">
          Manage your patient roster
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