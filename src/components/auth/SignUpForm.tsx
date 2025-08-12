import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { signUpSchema, type SignUpFormData } from '@/lib/validation';
import { z } from 'zod';

interface SignUpFormProps {
  onToggleForm: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleForm }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'patient' as 'patient' | 'caregiver' | 'provider',
    phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form data with Zod
      const validatedData = signUpSchema.parse(formData);
      
      await signUp(validatedData.email, validatedData.password, {
        full_name: validatedData.full_name,
        role: validatedData.role,
        phone: validatedData.phone || '',
        emergency_contact_name: validatedData.emergency_contact_name || '',
        emergency_contact_phone: validatedData.emergency_contact_phone || '',
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || 'Please check your input and try again');
      } else {
        setError(err.message || 'An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-accessible-2xl font-bold text-primary">
          Join AgingCare+
        </CardTitle>
        <CardDescription className="text-accessible-base">
          Create your account to start managing your health
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-accessible-base">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-accessible-lg">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              required
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-accessible-lg">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-accessible-lg">Role</Label>
            <Select value={formData.role} onValueChange={(value: any) => setFormData({...formData, role: value})}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="caregiver">Caregiver</SelectItem>
                <SelectItem value="provider">Healthcare Provider</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-accessible-lg">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-accessible-lg">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
              className="h-12"
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full h-12 text-accessible-lg">
            {loading && <Loader2 className="mr-2 h-4 h-4 animate-spin" />}
            Create Account
          </Button>
          
          <Button type="button" variant="link" onClick={onToggleForm} className="w-full">
            Already have an account? Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};