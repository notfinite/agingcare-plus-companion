import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, FileText, DollarSign, AlertTriangle, Plus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InsuranceProvider {
  id: string;
  name: string;
  type: string;
  contact_info: any;
}

interface PatientInsurance {
  id: string;
  insurance_provider: InsuranceProvider;
  policy_number: string;
  group_number: string;
  member_id: string;
  coverage_start: string;
  coverage_end: string;
  is_primary: boolean;
  copay_amount: number;
  deductible_amount: number;
  out_of_pocket_max: number;
}

interface InsuranceClaim {
  id: string;
  insurance_provider: InsuranceProvider;
  claim_number: string;
  service_date: string;
  provider_name: string;
  service_description: string;
  billed_amount: number;
  covered_amount: number;
  patient_responsibility: number;
  status: string;
}

export const InsuranceManager = () => {
  const [insurancePolicies, setInsurancePolicies] = useState<PatientInsurance[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const { toast } = useToast();

  const [newPolicy, setNewPolicy] = useState({
    insurance_provider_id: '',
    policy_number: '',
    group_number: '',
    member_id: '',
    coverage_start: '',
    coverage_end: '',
    is_primary: false,
    copay_amount: '',
    deductible_amount: '',
    out_of_pocket_max: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) return;

      // Fetch insurance policies
      const { data: policiesData, error: policiesError } = await supabase
        .from('patient_insurance')
        .select(`
          *,
          insurance_provider:insurance_provider_id (*)
        `)
        .eq('patient_id', userProfile.id);

      if (policiesError) throw policiesError;
      setInsurancePolicies(policiesData || []);

      // Fetch claims
      const { data: claimsData, error: claimsError } = await supabase
        .from('insurance_claims')
        .select(`
          *,
          insurance_provider:insurance_provider_id (*)
        `)
        .eq('patient_id', userProfile.id)
        .order('service_date', { ascending: false });

      if (claimsError) throw claimsError;
      setClaims(claimsData || []);

      // Fetch insurance providers
      const { data: providersData, error: providersError } = await supabase
        .from('insurance_providers')
        .select('*')
        .order('name');

      if (providersError) throw providersError;
      setProviders(providersData || []);

    } catch (error) {
      console.error('Error fetching insurance data:', error);
      toast({
        title: "Error",
        description: "Failed to load insurance information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addInsurancePolicy = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) return;

      const { error } = await supabase
        .from('patient_insurance')
        .insert({
          patient_id: userProfile.id,
          insurance_provider_id: newPolicy.insurance_provider_id,
          policy_number: newPolicy.policy_number,
          group_number: newPolicy.group_number,
          member_id: newPolicy.member_id,
          coverage_start: newPolicy.coverage_start,
          coverage_end: newPolicy.coverage_end,
          is_primary: newPolicy.is_primary,
          copay_amount: parseFloat(newPolicy.copay_amount) || 0,
          deductible_amount: parseFloat(newPolicy.deductible_amount) || 0,
          out_of_pocket_max: parseFloat(newPolicy.out_of_pocket_max) || 0
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Insurance policy added successfully",
      });

      setShowAddPolicy(false);
      setNewPolicy({
        insurance_provider_id: '',
        policy_number: '',
        group_number: '',
        member_id: '',
        coverage_start: '',
        coverage_end: '',
        is_primary: false,
        copay_amount: '',
        deductible_amount: '',
        out_of_pocket_max: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error adding insurance policy:', error);
      toast({
        title: "Error",
        description: "Failed to add insurance policy",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'denied': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      case 'processed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 space-x-2">
        <div className="animate-spin h-5 w-5 border-2 border-primary/20 border-t-primary rounded-full"></div>
        <span>Securely retrieving your coverage details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Insurance Management</h2>
        <Dialog open={showAddPolicy} onOpenChange={setShowAddPolicy}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Insurance Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Insurance Policy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Insurance Provider</Label>
                <Select
                  value={newPolicy.insurance_provider_id}
                  onValueChange={(value) => setNewPolicy({...newPolicy, insurance_provider_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name} ({provider.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Policy Number</Label>
                  <Input
                    value={newPolicy.policy_number}
                    onChange={(e) => setNewPolicy({...newPolicy, policy_number: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Member ID</Label>
                  <Input
                    value={newPolicy.member_id}
                    onChange={(e) => setNewPolicy({...newPolicy, member_id: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Coverage Start</Label>
                  <Input
                    type="date"
                    value={newPolicy.coverage_start}
                    onChange={(e) => setNewPolicy({...newPolicy, coverage_start: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Coverage End</Label>
                  <Input
                    type="date"
                    value={newPolicy.coverage_end}
                    onChange={(e) => setNewPolicy({...newPolicy, coverage_end: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Copay</Label>
                  <Input
                    type="number"
                    value={newPolicy.copay_amount}
                    onChange={(e) => setNewPolicy({...newPolicy, copay_amount: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Deductible</Label>
                  <Input
                    type="number"
                    value={newPolicy.deductible_amount}
                    onChange={(e) => setNewPolicy({...newPolicy, deductible_amount: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Out-of-Pocket Max</Label>
                  <Input
                    type="number"
                    value={newPolicy.out_of_pocket_max}
                    onChange={(e) => setNewPolicy({...newPolicy, out_of_pocket_max: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={addInsurancePolicy} className="w-full">
                Add Policy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">Insurance Policies</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          {insurancePolicies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {policy.insurance_provider.name}
                      {policy.is_primary && (
                        <Badge variant="default">Primary</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {policy.insurance_provider.type.charAt(0).toUpperCase() + 
                       policy.insurance_provider.type.slice(1)} Insurance
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Policy Number</p>
                    <p className="text-sm text-muted-foreground">{policy.policy_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Member ID</p>
                    <p className="text-sm text-muted-foreground">{policy.member_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Copay</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(policy.copay_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Deductible</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(policy.deductible_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Coverage Period</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(policy.coverage_start).toLocaleDateString()} - {new Date(policy.coverage_end).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Out-of-Pocket Max</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(policy.out_of_pocket_max)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Claim #{claim.claim_number}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {claim.provider_name} - {new Date(claim.service_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(claim.status)}>
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">{claim.service_description}</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Billed Amount</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(claim.billed_amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Covered Amount</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(claim.covered_amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Your Responsibility</p>
                      <p className="text-sm font-semibold">{formatCurrency(claim.patient_responsibility)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Annual Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Billed</span>
                    <span className="font-semibold">
                      {formatCurrency(claims.reduce((sum, claim) => sum + claim.billed_amount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Insurance Covered</span>
                    <span className="font-semibold">
                      {formatCurrency(claims.reduce((sum, claim) => sum + claim.covered_amount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm">Your Responsibility</span>
                    <span className="font-semibold">
                      {formatCurrency(claims.reduce((sum, claim) => sum + claim.patient_responsibility, 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Pending Claims
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {claims.filter(claim => claim.status === 'pending').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Claims awaiting processing</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Coverage Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {insurancePolicies.map((policy) => (
                    <div key={policy.id} className="flex justify-between text-sm">
                      <span>{policy.insurance_provider.type}</span>
                      <Badge variant={policy.is_primary ? "default" : "secondary"}>
                        {policy.is_primary ? "Primary" : "Secondary"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};