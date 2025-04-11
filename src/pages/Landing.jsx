import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import image8 from "../assets/image9.webp";
import image9 from "../assets/image9.webp";
import CustomCursor from "@/components/ui/CustomCursor";
import { useNavigate } from "react-router-dom";

function Landing() {
  // Refs for scroll animations
  const navigate = useNavigate();
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
    switch (index) {
      case 1: return image1;
      case 2: return image2;
      case 3: return image3;
      case 4: return image4;
      default: return image1;
    }
  };




  return (
    <div className="min-h-screen overflow-x-hidden cursor-none">
      <CustomCursor />

      {/* Hero Section - Made more compact */}
      <motion.div
        className="hero-gradient relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 md:px-28 py-8 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div className="md:w-1/2 space-y-2">
              <Badge variant="blue" className="mb-1">✨ Connecting Talents Worldwide</Badge>

              <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold leading-tight mb-4">
                Turn Sprint spillover into rapid solutions
              </h1>

              {/* <p className="text-base md:text-lg text-gray-600 md:pr-8">
                Connect with pre-vetted developers who match your project needs. Our AI-driven platform finds the perfect talent for your tech challenges.
              </p> */}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="group"
                  onClick={() => navigate('/company/login')}
                >
                  Hire Developers
                  <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                </Button>
                <Link to="/developer/login">
                  <Button
                    variant="secondary"
                    size="lg"
                  >
                    Join as Developer
                  </Button>
                </Link>
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
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                      <span className="ml-2 text-xs font-medium">4.9/5</span>
                    </div>
                    <p className="text-xs text-gray-600">From <span className="font-bold text-blue-600">2,000+</span> satisfied clients</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2 relative w-full"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full">
                {/* Main image with enhanced animation */}
                <div className="absolute inset-0 animate-float">
                  <div className="relative z-20 w-full h-full">
                    <img
                      src={image4}
                      alt="Developer working"
                      className="w-full h-full object-contain object-center"
                      loading="eager"
                      priority="true"
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

      {/* Feature Cards Section */}
      <div className="relative -mt-24 z-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Card 1: Post Task */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-blue-100 h-full">
                {/* Updated header layout */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
                      <ClipboardList size={20} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Post a Task & Get Matches</h3>
                </div>
                <p className="text-sm text-gray-600">Create your project and get instantly matched with pre-vetted developers who perfectly align with your needs.</p>
              </div>
            </motion.div>

            {/* Card 2: Secure NDA */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-purple-100 h-full">
                {/* Updated header layout */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                      <Shield size={20} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">NDA Protected Environment</h3>
                </div>
                <p className="text-sm text-gray-600">Your intellectual property is safe with our legally binding NDAs and secure development environment.</p>
              </div>
            </motion.div>

            {/* Card 3: Escrow Payments */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-emerald-100 h-full">
                {/* Updated header layout */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                      <Wallet size={20} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Escrow Payments</h3>
                </div>
                <p className="text-sm text-gray-600">Secure milestone-based payments with no delays. Funds are safely held in escrow until work is approved.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Modern CTA Section with Creative Design */}
      <ScrollTrigger onEnter={() => console.log("CTA section in view")}>
        <div ref={ctaRef} className="py-20 relative overflow-hidden">
          {/* Dynamic background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59,130,246,0.15) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>

          {/* Animated shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.2, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-1/2 -left-32 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <FadeIn>
                {/* Modern Section Header with 3D effect */}
                <div className="text-center mb-24 perspective-1000">
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotateX: -20 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative"
                  >
                    {/* Animated background elements */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                      <div className="relative">
                        <motion.div
                          className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0]
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        <motion.div
                          className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-2xl opacity-20"
                          animate={{
                            scale: [1, 1.5, 1],
                            x: [-10, 10, -10]
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    </div>

                    {/* Enhanced Badge */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-block"
                    >
                      <Badge
                        variant="blue"
                        className="mb-4 relative px-4 py-2 backdrop-blur-sm bg-white/80 shadow-lg"
                      >
                        <motion.div
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="inline-block mr-2"
                        >
                          <Sparkles className="w-4 h-4 text-blue-500" />
                        </motion.div>
                        Platform Workflow
                      </Badge>
                    </motion.div>

                    {/* Animated Heading */}
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                      Experience the{' '}
                      <motion.span
                        className="relative inline-block"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                          Future
                        </span>
                        <motion.div
                          className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-100"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          style={{ transformOrigin: 'left' }}
                        />
                      </motion.span>{' '}
                      of<br />Freelance Collaboration
                    </h2>

                    {/* Animated Description */}
                    <motion.p
                      className="text-gray-600 max-w-2xl mx-auto text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Join our ecosystem where talented developers and innovative companies
                      <motion.span
                        className="inline-block text-blue-600 font-medium ml-1"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        create amazing things together
                      </motion.span>
                    </motion.p>
                  </motion.div>
                </div>

                {/* Modern Timeline Flow with 3D Cards */}
                <div className="relative space-y-18 px-18">
                  {/* Animated connection line */}
                  <motion.div
                    className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
                    style={{
                      background: 'linear-gradient(180deg, rgba(59,130,246,0.2) 0%, rgba(147,51,234,0.2) 50%, rgba(59,130,246,0.2) 100%)'
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: '100%', opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500"
                      animate={{ y: [0, '100%'], opacity: [1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Rest of the timeline steps will follow with existing structure */}
                  {/* Step 1: Company Search */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="md:w-2/5 relative group">
                        <div className="relative">
                          {/* Decorative elements */}
                          {/* <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div> */}


                          {/* Step content */}
                          <div className="relative rounded-xl overflow-hidden  p-1.5 ">
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <motion.img
                                src={image9}
                                alt="Company searching for developers"
                                className="w-full h-full object-contain object-center transform group-hover:scale-110 transition-transform duration-700"
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                              />

                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-3/5 md:pr-12">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-blue-500/20">
                              1
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-2xl font-bold text-gray-900">Post Your Project</h3>
                              <p className="text-sm text-blue-600 font-medium">Quick Start</p>
                            </div>
                          </div>


                          <p className="text-gray-600 leading-relaxed">
                            Describe your project needs and requirements. Our system helps you find the perfect match from our pool of verified developers.
                          </p>


                          <div className="flex flex-wrap gap-3 pt-2">
                            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200">
                              <ClipboardList className="w-3.5 h-3.5 mr-1 text-blue-600" />
                              Requirements
                            </Badge>
                            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200">
                              <DollarSign className="w-3.5 h-3.5 mr-1 text-blue-600" />
                              Budget
                            </Badge>
                            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200">
                              <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
                              Timeline
                            </Badge>
                          </div>

                          {/* Process steps */}
                          <div className="flex items-center gap-3 pt-4">
                            <div className="flex-1 h-1 bg-blue-100 rounded">
                              <motion.div
                                className="h-full bg-blue-500 rounded"
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                              />
                            </div>
                            <span className="text-xs font-medium text-blue-600">Step 1/4</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Steps 2-4 follow similar pattern with adjusted colors and content */}
                  {/* Step 2: Developer Application */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                      <div className="md:w-2/5 relative group">
                        <div className="relative">
                          {/* <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div> */}


                          <div className="relative rounded-xl overflow-hidden  p-1.5 ">
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <motion.img
                                src={image6}
                                alt="Developer applying for task"
                                className="w-full h-full object-contain object-center transform group-hover:scale-110 transition-transform duration-700"
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                              />
                              {/*  */}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-3/5 md:pl-12">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-purple-500/20">
                              2
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-2xl font-bold text-gray-900">Smart Matching</h3>
                              <p className="text-sm text-purple-600 font-medium">Better Growth</p>
                            </div>
                          </div>


                          <p className="text-gray-600 leading-relaxed">
                            Pre-vetted developers get matched with projects that align with their expertise. Our AI ensures the perfect fit between requirements and skills.
                          </p>


                          <div className="flex flex-wrap gap-3 pt-2">
                            <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-purple-200">
                              <Code2 className="w-3.5 h-3.5 mr-1 text-purple-600" />
                              Skill Match
                            </Badge>
                            <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-purple-200">
                              <UserCheck className="w-3.5 h-3.5 mr-1 text-purple-600" />
                              Verified Devs
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 pt-4">
                            <div className="flex-1 h-1 bg-purple-100 rounded">
                              <motion.div
                                className="h-full bg-purple-500 rounded"
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                              />
                            </div>
                            <span className="text-xs font-medium text-purple-600">Step 2/4</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Step 3: Development */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="md:w-2/5 relative group">
                        <div className="relative">


                          <div className="relative rounded-xl overflow-hidden p-1.5 ">
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <motion.img
                                src={image2}
                                alt="Developer working"
                                className="w-full h-full object-contain object-center transform group-hover:scale-110 transition-transform duration-700"
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                              />

                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-3/5 md:pr-12">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-cyan-500/20">
                              3
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-2xl font-bold text-gray-900">Build & Review</h3>
                              <p className="text-sm text-cyan-600 font-medium">Real-time Progress</p>
                            </div>
                          </div>


                          <p className="text-gray-600 leading-relaxed">
                            Developers work on projects while maintaining constant communication. Track progress and provide feedback in real-time.
                          </p>


                          <div className="flex flex-wrap gap-3 pt-2">
                            <Badge variant="outline" className="bg-gradient-to-r from-cyan-50 to-cyan-100/50 border-cyan-200">
                              <Code className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                              Development
                            </Badge>
                            <Badge variant="outline" className="bg-gradient-to-r from-cyan-50 to-cyan-100/50 border-cyan-200">
                              <MessageSquare className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                              Feedback
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 pt-4">
                            <div className="flex-1 h-1 bg-cyan-100 rounded">
                              <motion.div
                                className="h-full bg-cyan-500 rounded"
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                              />
                            </div>
                            <span className="text-xs font-medium text-cyan-600">Step 3/4</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Step 4: Completion */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                      <div className="md:w-2/5 relative group">
                        <div className="relative">
                          {/* <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div> */}


                          <div className="relative rounded-xl overflow-hidden p-1.5 ">
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <motion.img
                                src={image1}
                                alt="Project completion"
                                className="w-full h-full object-contain object-center transform group-hover:scale-110 transition-transform duration-700"
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                              />

                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-3/5 md:pl-12">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-green-500/20">
                              4
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-2xl font-bold text-gray-900">Complete & Pay</h3>
                              <p className="text-sm text-green-600 font-medium">Instant Payment</p>
                            </div>
                          </div>


                          <p className="text-gray-600 leading-relaxed">
                            Once the project is completed and approved, secure instant payment is released to the developer. Simple, fast, and transparent.
                          </p>


                          <div className="flex flex-wrap gap-3 pt-2">
                            <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-green-100/50 border-green-200">
                              <Check className="w-3.5 h-3.5 mr-1 text-green-600" />
                              Approved
                            </Badge>
                            <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-green-100/50 border-green-200">
                              <Wallet className="w-3.5 h-3.5 mr-1 text-green-600" />
                              Instant Pay
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 pt-4">
                            <div className="flex-1 h-1 bg-green-100 rounded">
                              <motion.div
                                className="h-full bg-green-500 rounded"
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                              />
                            </div>
                            <span className="text-xs font-medium text-green-600">Step 4/4</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center mt-24"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Hiring
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                  <Link to="/developer/login">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        Join as Developer
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gray-50"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </Link>
                </motion.div>
              </FadeIn>
            </div>
          </div>
        </div>
      </ScrollTrigger>

      {/* Modern Professional Footer */}
      <footer className="relative mt-20">
        {/* Modern gradient separator */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        <div className="bg-white relative">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12">
              {/* Brand Section */}
              <div className="col-span-2 md:col-span-4 space-y-6">
                <div className="flex items-center gap-2">
                  <Code2 className="w-8 h-8 text-blue-600" />
                  <h3 className="text-xl font-semibold">SprintFlow</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Transform your development workflow with our elite talent network. Experience seamless collaboration and exceptional results.
                </p>
                <div className="flex gap-4">
                  {[
                    {
                      href: "https://www.linkedin.com/in/shashant-kashyap-b812a0155/",
                      icon: (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      ),
                      label: "LinkedIn"
                    },
                    {
                      href: "https://www.instagram.com/kashyapshashant",
                      icon: (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      ),
                      label: "Instagram"
                    }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-span-1 md:col-span-2">
                <h4 className="font-semibold mb-4">Company</h4>
                <nav className="flex flex-col space-y-3">
                  {['About', 'Services', 'Blog', 'Careers'].map((item, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center group w-fit"
                      whileHover={{ x: 4 }}
                    >
                      <span className="relative">
                        {item}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 group-hover:w-full transition-all"></span>
                      </span>
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Legal Links */}
              <div className="col-span-1 md:col-span-2">
                <h4 className="font-semibold mb-4">Legal</h4>
                <nav className="flex flex-col space-y-3">
                  {['Privacy', 'Terms', 'Security', 'Support'].map((item, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center group w-fit"
                      whileHover={{ x: 4 }}
                    >
                      <span className="relative">
                        {item}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 group-hover:w-full transition-all"></span>
                      </span>
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Contact Form */}
              <div className="col-span-2 md:col-span-4">
                <h4 className="font-semibold mb-4">Get in Touch</h4>
                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const message = e.target.message.value;
                    window.location.href = `mailto:shashant.kashyap999@gmail.com?subject=Contact Request&body=${encodeURIComponent(message)}`;
                  }}
                >
                  <Textarea
                    name="message"
                    placeholder="How can we help?"
                    className="w-full text-sm bg-gray-50 border-gray-100 hover:border-gray-200 focus:border-blue-200 rounded-lg resize-none transition-colors"
                    rows={3}
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm"
                  >
                    Send Message
                  </Button>
                </form>
                <div className="mt-4 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    shashant.kashyap999@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} SprintFlow. All rights reserved.
                </p>
                <div className="text-sm text-gray-500">
                  Made with <span className="text-red-500">♥</span> for developers
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Keep scroll helper and debug indicator */}
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

