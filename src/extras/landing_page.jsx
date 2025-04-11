<div ref={featuresRef} className="py-24 relative overflow-hidden">
        {/* Creative animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-purple-50/50"></div>
        
        {/* Enhanced background elements with more depth and style */}
        <div className="absolute inset-0">
          {/* Multi-layered gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/3 to-purple-500/5"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-50/30 to-transparent"></div>
          
          {/* Soft radial gradient spots */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-200/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl"></div>
          
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")` 
               }}>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.08)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </radialGradient>
              <radialGradient id="circleGradient2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="rgba(124, 58, 237, 0.07)" />
                <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
              </radialGradient>
            </defs>
            <motion.circle 
              cx="10" 
              cy="10" 
              r="20" 
              fill="url(#circleGradient)"
              initial={{ opacity: 0.2 }}
              animate={{ 
                cx: [10, 90, 10],
                cy: [10, 90, 10],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle 
              cx="90" 
              cy="90" 
              r="15" 
              fill="url(#circleGradient2)"
              initial={{ opacity: 0.3 }}
              animate={{ 
                cx: [90, 10, 90],
                cy: [90, 10, 90],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </svg>
          
          {/* Animated grid pattern with improved styling */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Enhanced floating shapes with depth and blur */}
          <motion.div
            className="absolute top-1/4 left-[15%] w-16 h-16 bg-blue-200/30 rounded-lg blur-sm"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0],
              opacity: [0.6, 0.3, 0.6]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          
          <motion.div
            className="absolute top-2/3 left-[65%] w-20 h-20 bg-indigo-200/20 rounded-full blur-sm"
            animate={{ 
              y: [0, 15, 0],
              x: [0, -15, 0],
              rotate: [0, -5, 0],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          ></motion.div>
          
          <motion.div
            className="absolute bottom-1/4 right-[15%] w-24 h-24 bg-purple-200/20 rounded-full blur-sm"
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          
          {/* Animated line accents */}
          <svg className="absolute inset-0 w-full h-full overflow-visible opacity-20" style={{ mixBlendMode: 'overlay' }}>
            <motion.path
              d="M -100,40 C 0,100 200,0 300,100"
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M 400,20 C 300,50 100,150 0,100"
              stroke="rgba(124, 58, 237, 0.3)"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="purple" className="mb-3">Platform Advantages</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
                How We <span className="text-gradient">Transform</span> Your Hiring
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Our platform streamlines the developer hiring process, giving you access to elite talent without the hassle.
              </p>
            </div>
          </FadeIn>
          
          {/* Interactive Feature Showcase */}
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Decorative Background Elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300/10 rounded-full blur-3xl"></div>
              
              {/* Features Content with Tabs */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Left Column - Interactive Feature Image */}
                <div className="relative order-2 lg:order-1">
                  <motion.div 
                    className="relative h-[450px] bg-gradient-to-br from-white to-blue-50 p-3 rounded-2xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden">
                      <div className="absolute top-4 left-4 bg-black/5 backdrop-blur-sm py-1 px-3 rounded-full text-xs font-medium text-gray-700 z-20">
                        Trusted by 2,000+ companies
                      </div>
                      
                      {/* Interactive Glow Effect */}
                      <motion.div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-400/10 rounded-full filter blur-3xl z-0"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      ></motion.div>
                      
                      {/* Interactive Feature Visual */}
                      <div className="h-full flex items-center justify-center">
                        <motion.div 
                          className="relative w-full max-w-md"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Feature Visual */}
                          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-xl bg-white">
                            <div className="bg-gradient-to-br from-white via-blue-50/30 to-white p-5">
                              <div className="flex items-center mb-5">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mr-4">
                                  <Shield className="text-blue-600 w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">Elite Talent Verification</h3>
                                  <p className="text-sm text-gray-500">Only the top 3% make it through</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium">Technical Skills</span>
                                  <div className="w-2/3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                      initial={{ width: 0 }}
                                      whileInView={{ width: '90%' }}
                                      transition={{ duration: 1.5, delay: 0.2 }}
                                      viewport={{ once: true }}
                                    ></motion.div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium">Communication</span>
                                  <div className="w-2/3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                      initial={{ width: 0 }}
                                      whileInView={{ width: '85%' }}
                                      transition={{ duration: 1.5, delay: 0.4 }}
                                      viewport={{ once: true }}
                                    ></motion.div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium">Problem Solving</span>
                                  <div className="w-2/3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                      initial={{ width: 0 }}
                                      whileInView={{ width: '95%' }}
                                      transition={{ duration: 1.5, delay: 0.6 }}
                                      viewport={{ once: true }}
                                    ></motion.div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium">Project Management</span>
                                  <div className="w-2/3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                      initial={{ width: 0 }}
                                      whileInView={{ width: '80%' }}
                                      transition={{ duration: 1.5, delay: 0.8 }}
                                      viewport={{ once: true }}
                                    ></motion.div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center -space-x-2">
                                    <motion.div 
                                      className="h-7 w-7 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
                                      style={{backgroundImage: `url(${image1})`}}
                                      whileHover={{ scale: 1.2, zIndex: 10 }}
                                    ></motion.div>
                                    <motion.div 
                                      className="h-7 w-7 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
                                      style={{backgroundImage: `url(${image2})`}}
                                      whileHover={{ scale: 1.2, zIndex: 10 }}
                                    ></motion.div>
                                    <motion.div 
                                      className="h-7 w-7 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
                                      style={{backgroundImage: `url(${image3})`}}
                                      whileHover={{ scale: 1.2, zIndex: 10 }}
                                    ></motion.div>
                                    <motion.div 
                                      className="h-7 w-7 rounded-full flex items-center justify-center text-xs bg-blue-100 text-blue-600 border-2 border-white shadow-sm"
                                      whileHover={{ scale: 1.2, zIndex: 10 }}
                                    >+8</motion.div>
                                  </div>
                                  <motion.span 
                                    className="text-xs font-medium text-blue-600 flex items-center"
                                    whileHover={{ x: 3 }}
                                  >
                                    View talent pool 
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                  </motion.span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Floating elements */}
                          <motion.div 
                            className="absolute -top-6 -right-6 bg-white shadow-lg rounded-lg p-2 border border-gray-100"
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <CheckCircle2 className="text-green-500" size={20} />
                          </motion.div>
                          
                          <motion.div 
                            className="absolute -bottom-4 -left-4 bg-white shadow-lg rounded-lg p-2 border border-gray-100"
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                          >
                            <Clock className="text-blue-500" size={20} />
                          </motion.div>
                          
                          <motion.div 
                            className="absolute top-1/2 -right-10 bg-white shadow-lg rounded-lg p-2 border border-gray-100"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }}
                            transition={{ 
                              opacity: { duration: 0.3 },
                              scale: { duration: 0.3 },
                              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }
                            }}
                          >
                            <div className="flex items-center space-x-1">
                              <Star className="text-yellow-500 w-4 h-4 fill-yellow-500" />
                              <span className="text-xs font-semibold">Top 3%</span>
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Right Column - Features List */}
                <div className="order-1 lg:order-2">
                  <div className="space-y-6">
                    {/* Feature 1 */}
                    <motion.div 
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-300 ease-in-out"></div>
                      
                      <div className="flex items-start relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4 flex-shrink-0">
                          <Shield className="text-blue-600 w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2 text-gray-800">Pre-Vetted Talent Pool</h3>
                          <p className="text-gray-600 mb-3 text-sm">
                            Our rigorous vetting process means you only work with the top 3% of developers, ensuring quality for every project.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="blue">Technical assessment</Badge>
                            <Badge variant="blue">Background checks</Badge>
                            <Badge variant="blue">Portfolio review</Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Feature 2 */}
                    <motion.div 
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-green-400 to-green-600 group-hover:w-full transition-all duration-300 ease-in-out"></div>
                      
                      <div className="flex items-start relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mr-4 flex-shrink-0">
                          <DollarSign className="text-green-600 w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2 text-gray-800">Transparent Pricing</h3>
                          <p className="text-gray-600 mb-3 text-sm">
                            No hidden fees or surprise costs. Our transparent pricing model means you know exactly what you're paying for.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="green">No surprise fees</Badge>
                            <Badge variant="green">Milestone payments</Badge>
                            <Badge variant="green">Money-back guarantee</Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Feature 3 */}
                    <motion.div 
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-400 to-orange-600 group-hover:w-full transition-all duration-300 ease-in-out"></div>
                      
                      <div className="flex items-start relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mr-4 flex-shrink-0">
                          <Clock className="text-orange-600 w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2 text-gray-800">AI-Powered Matching</h3>
                          <p className="text-gray-600 mb-3 text-sm">
                            Our algorithm intelligently matches your project with the perfect developer based on skills, experience, and availability.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="orange">1-day matchmaking</Badge>
                            <Badge variant="orange">Skill-based algorithm</Badge>
                            <Badge variant="orange">Timezone compatibility</Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



//////////////////////////////////////////////
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  DollarSign, 
  ClipboardList, 
  Code, 
  Star, 
  Users, 
  ArrowRight, 
  ArrowUpRight,
  Sparkles,
  Globe,
  Clock,
  CheckCircle2,
  Zap,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Building2,
  Code2,
  UserCheck,
  Search,
  Wallet,
  MessageSquare,
  Check,
  ArrowUp
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  FadeIn, 
  SlideIn, 
  ScaleIn, 
  ScrollTrigger,
  DirectionalStaggerContainer,
  DirectionalStaggerItem
} from "@/components/ui/animation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import image4 from "../assets/image4.webp";
import image3 from "../assets/image3.webp";
import image2 from "../assets/image2.webp";
import image6 from "../assets/image6.webp";
import image1 from "../assets/image1.webp";
import image8 from "../assets/image9(1).webp";
import image9 from "../assets/image9(2).webp";

function Landing() {
  // Refs for scroll animations
  const metricsRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const videoRef = useRef(null);
  
  // Video state management
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  // Get current scroll direction
  const scrollDirection = useScrollDirection();
  
  // Scroll progress animations
  const { scrollYProgress } = useScroll();
  
  // Helper function to get avatar images
  const getAvatarImage = (index) => {
    switch(index) {
      case 1: return image1;
      case 2: return image2;
      case 3: return image3;
      case 4: return image4;
      default: return image1;
    }
  };
  
  // Video control handlers
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Auto-play video when it enters viewport
  const handleVideoInView = (inView) => {
    if (inView && videoRef.current && !isPlaying) {
      videoRef.current.play().catch(e => {
        console.log("Auto-play prevented:", e);
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section - Made more compact */}
      <motion.div 
        className="hero-gradient relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto px-28 py-12  md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row  items-center gap-8">
            <motion.div 
              className="md:w-1/2 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Badge variant="blue" className="mb-1">✨ Connecting Talents Worldwide</Badge>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                Find <span className="text-gradient">Elite Developers</span> for Your Vision
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 md:pr-8">
                Connect with pre-vetted developers who match your project needs. Our AI-driven platform finds the perfect talent for your tech challenges.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="group"
                >
                  Hire Developers
                  <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                >
                  Join as Developer
                </Button>
              </div>
              
              <div className="pt-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 ring-1 ring-white hover:ring-4 hover:ring-blue-500 hover:scale-110 transition-all duration-300 relative group"
                        style={{
                          backgroundImage: `url(${getAvatarImage(i)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                        whileHover={{ rotate: 10 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-blue-500 opacity-0 rounded-full group-hover:opacity-20 transition-opacity duration-300"
                        ></motion.div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    <div className="flex items-center">
                      <div className="text-yellow-500 flex">
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                      <span className="ml-2 text-xs font-medium">4.9/5</span>
                    </div>
                    <p className="text-xs text-gray-600">From <span className="font-bold text-blue-600">2,000+</span> satisfied clients</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative h-[300px] md:h-[400px]">
                {/* Main image with enhanced animation */}
                <div className="absolute inset-0 animate-float">
                  <div className="relative z-20 w-full h-full">
                    <img 
                      src={image4} 
                      alt="Developer working" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  
                  {/* Shadow effect */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-4/5 h-8 bg-blue-900/10 filter blur-xl rounded-full"></div>
                </div>
                
                {/* Floating elements with glass effect */}
                <motion.div 
                  className="absolute -left-4 bottom-16 glass-effect p-2.5 rounded-xl shadow-blue"
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2">
                    <Code className="text-blue-600" size={18} />
                    <span className="text-xs font-medium">25k+ Projects</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute top-16 -right-2 glass-effect p-2.5 rounded-xl shadow-blue"
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="text-blue-600" size={18} />
                    <span className="text-xs font-medium">100+ Countries</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute top-1/2 left-0 glass-effect p-2.5 rounded-xl shadow-blue"
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-600" size={18} />
                    <span className="text-xs font-medium">10k+ Developers</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Bar - Fade in on scroll */}
      <FadeIn>
        <div ref={metricsRef} className="  border-y border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { number: "10k+", text: "Expert Developers" },
                { number: "25k+", text: "Projects Completed" },
                { number: "100+", text: "Countries Worldwide" },
                { number: "98%", text: "Client Satisfaction" }
              ].map((item, i) => (
                <ScaleIn key={i} delay={i * 0.1}>
                  <div className="space-y-1">
                    <p className="text-2xl md:text-3xl font-bold text-blue-600">{item.number}</p>
                    <p className="text-xs md:text-sm text-gray-500">{item.text}</p>
                  </div>
                </ScaleIn>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>


      {/* Modern CTA Section with Light Theme */}
      <ScrollTrigger onEnter={() => console.log("CTA section in view")}>
        <div ref={ctaRef} className="py-20 relative overflow-hidden bg-gradient-to-br from-white to-blue-50">
          {/* Light network background effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59,130,246,0.15) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <FadeIn>
                {/* Section Header */}
                <div className="text-center mb-16">
                  <Badge variant="blue" className="mb-4">Platform Workflow</Badge>
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                    How Our <span className="text-blue-600">AI-Powered</span> Platform Works
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Experience seamless collaboration between companies and developers through our intelligent matching system
                  </p>
                </div>

                {/* Companies Flow */}
                <div className="mb-20">
                  <div className="flex items-center justify-center gap-2 mb-12">
                    <Building2 className="text-blue-600" size={28} />
                    <h3 className="text-2xl font-semibold text-gray-900">For Companies</h3>
                  </div>
                  
                  <div className="relative">
                    {/* Animated connection line */}
                    <motion.div
                      className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    ></motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                      {/* Step 1 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                      >
                        <div className="relative group">
                          {/* Light glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-blue-50/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                          
                          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-100 hover:border-blue-200 transition-colors shadow-lg hover:shadow-xl">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <ClipboardList className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Post Project</h4>
                            <p className="text-gray-600 text-sm">Define your project requirements and set your budget range</p>
                            
                            <div className="mt-4 flex gap-2">
                              <span className="px-2 py-1 bg-blue-50 rounded-md text-xs text-blue-600">Requirements</span>
                              <span className="px-2 py-1 bg-blue-50 rounded-md text-xs text-blue-600">Budget</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Step 2 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative z-10"
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-purple-50/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                          
                          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 hover:border-purple-200 transition-colors shadow-lg hover:shadow-xl">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">AI Matching</h4>
                            <p className="text-gray-600 text-sm">Our AI matches your project with the perfect developers</p>
                            
                            <div className="mt-4 flex gap-2">
                              <span className="px-2 py-1 bg-purple-50 rounded-md text-xs text-purple-600">Skills</span>
                              <span className="px-2 py-1 bg-purple-50 rounded-md text-xs text-purple-600">Experience</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Step 3 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="relative z-10"
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 to-cyan-50/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                          
                          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-100 hover:border-cyan-200 transition-colors shadow-lg hover:shadow-xl">
                            <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <MessageSquare className="w-6 h-6 text-cyan-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Collaborate</h4>
                            <p className="text-gray-600 text-sm">Work directly with your matched developer</p>
                            
                            <div className="mt-4 flex gap-2">
                              <span className="px-2 py-1 bg-cyan-50 rounded-md text-xs text-cyan-600">Chat</span>
                              <span className="px-2 py-1 bg-cyan-50 rounded-md text-xs text-cyan-600">Milestones</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Step 4 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="relative z-10"
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-green-50/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                          
                          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-green-100 hover:border-green-200 transition-colors shadow-lg hover:shadow-xl">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Complete</h4>
                            <p className="text-gray-600 text-sm">Approve work and release secure payment</p>
                            
                            <div className="mt-4 flex gap-2">
                              <span className="px-2 py-1 bg-green-50 rounded-md text-xs text-green-600">Review</span>
                              <span className="px-2 py-1 bg-green-50 rounded-md text-xs text-green-600">Payment</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Developers Flow */}
                <div className="mb-16">
                  <div className="flex items-center justify-center gap-2 mb-12">
                    <Code2 className="text-purple-600" size={28} />
                    <h3 className="text-2xl font-semibold text-gray-900">For Developers</h3>
                  </div>
                  
                  <div className="relative">
                    {/* Animated connection line */}
                    <motion.div
                      className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    ></motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                      {/* Step 1 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-indigo-50/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                          
                          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-indigo-100 hover:border-indigo-200 transition-colors shadow-lg hover:shadow-xl">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <UserCheck className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Join Network</h4>
                            <p className="text-gray-600 text-sm">Complete verification process to join elite developers</p>
                            
                            <div className="mt-4 flex gap-2">
                              <span className="px-2 py-1 bg-indigo-50 rounded-md text-xs text-indigo-600">Skills Test</span>
                              <span className="px-2 py-1 bg-indigo-50 rounded-md text-xs text-indigo-600">Verify</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Step 2 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative z-10"
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 to-pink-50/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                          
                          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-pink-100 hover:border-pink-200 transition-colors shadow-lg hover:shadow-xl">
                            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Search className="w-6 h-6 text-pink-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Find Projects</h4>
                            <p className="text-gray-600 text-sm">Get matched with relevant opportunities</p>
                            
                            <div className="mt-4 flex gap-2">
                              <span className="px-2 py-1 bg-pink-50 rounded-md text-xs text-pink-600">Browse</span>
                              <span className="px-2 py-1 bg-pink-50 rounded-md text-xs text-pink-600">Match</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Step 3 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="relative z-10"
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-orange-50/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                          
                          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-orange-100 hover:border-orange-200 transition-colors shadow-lg hover:shadow-xl">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Code className="w-6 h-6 text-orange-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Build & Deliver</h4>
                            <p className="text-gray-600 text-sm">Work on exciting projects that match your skills</p>
                            
                            <div className="mt-4 flex gap-2">
                              <span className="px-2 py-1 bg-orange-50 rounded-md text-xs text-orange-600">Code</span>
                              <span className="px-2 py-1 bg-orange-50 rounded-md text-xs text-orange-600">Deploy</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Step 4 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="relative z-10"
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-teal-50/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                          
                          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-teal-100 hover:border-teal-200 transition-colors shadow-lg hover:shadow-xl">
                            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Wallet className="w-6 h-6 text-teal-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Get Paid</h4>
                            <p className="text-gray-600 text-sm">Receive secure payments for completed work</p>
                            
                            <div className="mt-4 flex gap-2">
                              <span className="px-2 py-1 bg-teal-50 rounded-md text-xs text-teal-600">Instant</span>
                              <span className="px-2 py-1 bg-teal-50 rounded-md text-xs text-teal-600">Secure</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center mt-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0"
                  >
                    Start Hiring
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
                  >
                    Join as Developer
                  </Button>
                </motion.div>
              </FadeIn>
            </div>
          </div>
        </div>
      </ScrollTrigger>
      
      {/* Smooth scroll helpers */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <motion.div 
          className="flex flex-col gap-3 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-white shadow-lg rounded-full hover:bg-blue-50 transition-colors"
          >
            <ArrowUpRight size={20} className="text-blue-600" />
          </button>
        </motion.div>
      </div>
      
      {/* Debug indicator - remove in production */}
      <div className="fixed top-4 right-4 z-50 bg-white p-2 rounded-md shadow-md text-sm font-mono opacity-70">
        {/* <p>Scroll: {scrollDirection}</p> */}
      </div>
    </div>
  );
}

export default Landing;

