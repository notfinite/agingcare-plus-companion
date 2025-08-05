import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onToggleForm: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-accessible-2xl font-bold text-primary">
          Welcome to AgingCare+
        </CardTitle>
        <CardDescription className="text-accessible-base">
          Sign in to manage your health journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-accessible-base">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            <Label htmlFor="email" className="text-accessible-lg font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-accessible-base h-14"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="password" className="text-accessible-lg font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-accessible-base h-14 pr-14"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-accessible-lg font-semibold"
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Sign In
          </Button>
          
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={onToggleForm}
              className="text-accessible-base"
            >
              Don't have an account? Sign up here
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};