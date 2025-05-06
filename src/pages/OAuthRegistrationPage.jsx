import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Shield, Code } from 'lucide-react';
import { authUtils } from '../utils/authUtils';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.enum(["DEVELOPER", "CORPORATE"], {
    required_error: "Please select a role.",
  }),
});

const OAuthRegistrationPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const oauthToken = authUtils.getAuthToken();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: undefined,
    },
  });

  useEffect(() => {
    if (!oauthToken) {
      toast.error('No authentication token found. Please try logging in again.');
      navigate('/');
    }
  }, [oauthToken, navigate]);

  const onSubmit = async (data) => {
    if (!oauthToken) {
      toast.error('No authentication token found. Please try logging in again.');
      return;
    }

    setIsLoading(true);

    try {
      // Complete registration with OAuth token
      const response = await axios.post(
        `${apiUrl}/v1/auth/complete-registration`,
        {
          name: data.name,
          role: data.role,
        },
        {
          headers: {
            Authorization: oauthToken,
          },
        }
      );

      // If successful, get the final token
      const token = response.data.token || oauthToken;
      
      // Login with the token
      login(token);
      
      toast.success('Registration completed successfully!');
      
      // Redirect based on role
      if (data.role === 'DEVELOPER') {
        navigate('/developer/dashboard');
      } else {
        navigate('/company/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-xl border-blue-100">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Registration</CardTitle>
          <CardDescription>Please provide the following information to complete your account setup.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I am a:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-blue-50 cursor-pointer">
                          <RadioGroupItem value="DEVELOPER" id="developer" />
                          <label htmlFor="developer" className="flex items-center cursor-pointer">
                            <Code className="mr-2 h-4 w-4 text-blue-600" />
                            <span>Developer</span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-blue-50 cursor-pointer">
                          <RadioGroupItem value="CORPORATE" id="company" />
                          <label htmlFor="company" className="flex items-center cursor-pointer">
                            <Shield className="mr-2 h-4 w-4 text-indigo-600" />
                            <span>Company</span>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing Registration...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-xs text-gray-500 text-center">
            By completing registration, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OAuthRegistrationPage;
