import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "../components/ui/card";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "../components/ui/alert";
import {
  Code2,
  Briefcase,
  Sparkles,
  Star,
  UserPlus,
  Loader2,
  Mail,
  Check,
  AlertCircle,
  Lock,
  User
} from "lucide-react";

// Form validation schema
const signupSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must be less than 50 characters." }),
  email: z.string()
    .email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["DEVELOPER", "CORPORATE"])
});

const Signup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: ""
    },
  });

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    form.setValue("role", role);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role,
        cred: data.password
      };
      
      // Send signup request to API
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/v1/users`, 
        payload
      );
      
      setSuccess(`Your ${data.role === "DEVELOPER" ? "developer" : "company"} account has been created successfully! Please check your email to verify your account.`);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(`/${data.role === "DEVELOPER" ? "developer" : "company"}/login`);
      }, 3000);
      
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute w-full h-full top-0 left-0 overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`blob-${i}`}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20"
            style={{
              background: i % 2 === 0 ? "linear-gradient(180deg, #4F46E5 0%, #9333EA 100%)" : "linear-gradient(180deg, #3B82F6 0%, #2DD4BF 100%)",
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              scale: [1, Math.random() * 0.2 + 0.9],
              rotate: [0, Math.random() * 20 - 10],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 15 + 10,
            }}
          />
        ))}

      </div>
      
      <motion.div
        className="z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl">
          <CardHeader className="text-center pt-8">
            <div className="flex justify-center mb-2">
              <motion.div
                className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
            </div>
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription>Join our talent network and grow your career or business</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Role selection cards */}
            <div className="space-y-3">
              <label className="text-sm font-medium">I am a:</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Developer role card */}
                <motion.div
                  className={`cursor-pointer rounded-lg p-4 border-2 ${
                    selectedRole === "DEVELOPER" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                  } transition-colors relative overflow-hidden group`}
                  onClick={() => handleRoleSelect("DEVELOPER")}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`flex flex-col items-center space-y-2 ${
                    selectedRole === "DEVELOPER" ? "text-blue-600" : "text-gray-600"
                  }`}>
                    <Code2 className="h-6 w-6" />
                    <span className="font-medium">Developer</span>
                  </div>
                  {selectedRole === "DEVELOPER" && (
                    <motion.div
                      className="absolute -right-1 -top-1 bg-blue-500 rounded-full p-0.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                  <motion.div 
                    className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-20"
                    initial={false}
                    animate={{ opacity: selectedRole === "DEVELOPER" ? 0 : 0 }}
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
                
                {/* Company role card */}
                <motion.div
                  className={`cursor-pointer rounded-lg p-4 border-2 ${
                    selectedRole === "CORPORATE" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
                  } transition-colors relative overflow-hidden group`}
                  onClick={() => handleRoleSelect("CORPORATE")}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`flex flex-col items-center space-y-2 ${
                    selectedRole === "CORPORATE" ? "text-indigo-600" : "text-gray-600"
                  }`}>
                    <Briefcase className="h-6 w-6" />
                    <span className="font-medium">Company</span>
                  </div>
                  {selectedRole === "CORPORATE" && (
                    <motion.div
                      className="absolute -right-1 -top-1 bg-indigo-500 rounded-full p-0.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                  <motion.div 
                    className="absolute inset-0 bg-indigo-100 opacity-0 group-hover:opacity-20"
                    initial={false}
                    animate={{ opacity: selectedRole === "CORPORATE" ? 0 : 0 }}
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Signup form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{selectedRole === "CORPORATE" ? "Company Name" : "Full Name"}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            placeholder={selectedRole === "CORPORATE" ? "Acme Inc." : "John Doe"} 
                            {...field} 
                            className="pl-10" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{selectedRole === "CORPORATE" ? "Business Email" : "Email Address"}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            type="email" 
                            placeholder={selectedRole === "CORPORATE" ? "contact@acmeinc.com" : "johndoe@example.com"} 
                            {...field} 
                            className="pl-10" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className="pl-10" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Hidden role field */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    className={`w-full ${!selectedRole ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 
                      selectedRole === 'DEVELOPER' ? 'bg-blue-600 hover:bg-blue-700' : 
                      'bg-indigo-600 hover:bg-indigo-700'}`}
                    disabled={isSubmitting || !selectedRole}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        {selectedRole ? `Sign Up as ${selectedRole === "DEVELOPER" ? "Developer" : "Company"}` : "Sign Up"}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center space-y-4 pt-0 pb-8">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Sign in
              </Link>
            </p>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i}
                    size={12}
                    fill="currentColor"
                    className="text-amber-400"
                  />
                ))}
              </div>
              <span className="ml-1">Trusted by 2,000+ professionals worldwide</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
