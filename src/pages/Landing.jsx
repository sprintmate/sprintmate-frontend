import React, { useRef, useState, useEffect } from "react";
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
  MapPin,
  Phone,
  ArrowUp
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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
import image8 from "../assets/image8.webp";
import image9 from "../assets/image9.webp";
import CustomCursor from "@/components/ui/CustomCursor";
import { useNavigate } from "react-router-dom";
import { authUtils } from "../utils/authUtils";
import { fetchAppConfig, fetchAppConfigWithCache } from "../api/configService";
import SocialLinks from "../components/SocialLink";
import FeedbackForm from "../components/common/FeedbackForm";
import { trackEvent } from "../utils/analytics";
import { getUTMParams } from "../utils/utm";
import { Dialog } from "@headlessui/react"; // Add this for accessible modal

function Landing() {
  // Refs for scroll animations
  const navigate = useNavigate();
  const metricsRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [appConfig, setAppConfig] = useState(false);


  // Video state management
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Get current scroll direction
  const scrollDirection = useScrollDirection();

  // Scroll progress animations
  const { scrollYProgress } = useScroll();

  // Check if device is mobile
  useEffect(() => {
    // Clear localStorage and sessionStorage
    const utm = getUTMParams();
    trackEvent('landing_page_view', utm);
    authUtils.clearAllData();
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkMobile);

    const init = async () => {
      const appConfig = await fetchAppConfigWithCache();
      // You can use appConfig here if needed
      console.log('fetched app config', appConfig);
      setAppConfig(appConfig?.data?.config);
      checkMobile();
    };

    init();

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupSection, setPopupSection] = useState(null);

  // Section content
  const sectionContent = {
    contact: {
      title: "Contact Us",
      desc: (
        <div className="space-y-3 text-sm">
          {/* Email */}
          <p className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            {(appConfig?.EMAIL?.split(',') || []).map((email, index) => (
              <span key={index} className="text-gray-700">{email.trim()}</span>
            ))}
          </p>

          {/* Phone Number */}
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">{appConfig?.PHONE_NUMBER || "+91 98765 43210"}</span>
          </p>

          {/* Address */}
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">{appConfig?.ADDRESS || "Bangalore, India"}</span>
          </p>

          {/* Working Hours */}
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">Mon - Fri: 10:00 AM to 6:00 PM IST</span>
          </p>
        </div>
      ),
    },
    About: {
      title: "About",
      desc: (
        <>
          <span className="font-semibold text-blue-600">SprintFlow</span> is a modern freelance platform connecting innovative companies with top-tier developers worldwide. Our mission is to streamline collaboration, ensuring every project is a success story.
        </>
      ),
    },
    Services: {
      title: "Services",
      desc: (
        <>
          <ul className="list-disc pl-5 space-y-1">
            <li>Post and manage development tasks with ease</li>
            <li>Smart AI-powered developer matching</li>
            <li>Secure in-platform chat and file sharing</li>
            <li>Milestone-based escrow payments</li>
            <li>Real-time project tracking and feedback</li>
            <li>Comprehensive support for both companies and developers</li>
          </ul>
        </>
      ),
    },
    Blog: {
      title: "Blog",
      desc: (
        <>
          Explore insights, tips, and success stories from the world of remote work, freelance development, and digital transformation. Stay updated with the latest trends and platform updates.
        </>
      ),
    },
    Careers: {
      title: "Careers",
      desc: (
        <>
          Join our passionate team and help shape the future of freelance collaboration. We’re always looking for creative minds who thrive in a fast-paced, innovative environment.
        </>
      ),
    },
    Privacy: {
      title: "Privacy Policy",
      desc: (
        <div className="relative px-3 py-5 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-lg border border-blue-100 max-w-3xl mx-auto text-[0.89rem] leading-tight">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <Shield className="text-blue-500" size={20} />
            <span className="uppercase tracking-widest text-[10px] font-semibold text-blue-600">Privacy Policy</span>
          </div>
          <div className="text-[10px] text-gray-400 mb-4 text-center">Last Updated: May 25, 2025</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">1</span>
                <div>
                  <span className="font-semibold text-blue-700">What We Collect:</span>
                  <ul className="ml-3 mt-1 list-disc text-gray-700 text-sm space-y-1">
                    <li>Name, email, and profile info</li>
                    <li>Payment and billing details</li>
                    <li>Messages via platform chat</li>
                    <li>Device/browser info for security</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">2</span>
                <div>
                  <span className="font-semibold text-blue-700">How We Use It:</span>
                  <ul className="ml-3 mt-1 list-disc text-gray-700 text-sm space-y-1">
                    <li>Match developers with tasks</li>
                    <li>Process payments securely</li>
                    <li>Improve platform safety & performance</li>
                    <li>Send updates and support info</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">3</span>
                <div>
                  <span className="font-semibold text-blue-700">Data Sharing:</span>
                  <span className="ml-1 text-gray-700">No selling. Shared only with trusted partners for platform operation (e.g., payments, analytics).</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">4</span>
                <div>
                  <span className="font-semibold text-blue-700">Cookies:</span>
                  <span className="ml-1 text-gray-700">Used for sessions and improving experience. You can disable cookies in your browser.</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">5</span>
                <div>
                  <span className="font-semibold text-blue-700">Security:</span>
                  <span className="ml-1 text-gray-700">We use HTTPS, encryption, and access controls to protect your data.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">6</span>
                <div>
                  <span className="font-semibold text-blue-700">Your Rights:</span>
                  <span className="ml-1 text-gray-700">Access, update, or delete your data anytime in account settings. For removal, contact us.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">7</span>
                <div>
                  <span className="font-semibold text-blue-700">Retention:</span>
                  <span className="ml-1 text-gray-700">We keep data while your account is active or as required by law.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">8</span>
                <div>
                  <span className="font-semibold text-blue-700">Children:</span>
                  <span className="ml-1 text-gray-700">Platform is for users 18+. We do not knowingly collect data from minors.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">9</span>
                <div>
                  <span className="font-semibold text-blue-700">Policy Updates:</span>
                  <span className="ml-1 text-gray-700">We may update this policy. Major changes will be notified via email or alerts.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 justify-center">
            {/* <MessageSquare className="w-4 h-4 text-blue-500" /> */}
            {/* <span>Questions? <span className="underline text-blue-600">support@yourdomain.com</span></span> */}
          </div>
        </div>
      ),
    },
    Terms: {
      title: "Terms & Conditions",
      desc: (
        <div className="relative px-3 py-5 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-lg border border-blue-100 max-w-3xl mx-auto text-[0.89rem] leading-tight">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <Sparkles className="text-blue-500" size={20} />
            <span className="uppercase tracking-widest text-[10px] font-semibold text-blue-600">Terms & Conditions</span>
          </div>
          <div className="text-[10px] text-gray-400 mb-4 text-center">Last Updated: May 25, 2025</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">1</span>
                <div>
                  <span className="font-semibold text-blue-700">Eligibility:</span>
                  <span className="ml-1 text-gray-700">You must be 18+ to use SprintFlow.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">2</span>
                <div>
                  <span className="font-semibold text-blue-700">Account:</span>
                  <span className="ml-1 text-gray-700">Keep your login details secure. You’re responsible for your account activity.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">3</span>
                <div>
                  <span className="font-semibold text-blue-700">How It Works:</span>
                  <ul className="ml-3 mt-1 list-disc text-gray-700 text-sm space-y-1">
                    <li>Companies post tasks.</li>
                    <li>Developers apply and collaborate via chat.</li>
                    <li>All project communication stays on the platform.</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">4</span>
                <div>
                  <span className="font-semibold text-blue-700">Payments:</span>
                  <span className="ml-1 text-gray-700">Secure, milestone-based payments via trusted gateways. Raise disputes within 14 days if needed.</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">5</span>
                <div>
                  <span className="font-semibold text-blue-700">Respect:</span>
                  <span className="ml-1 text-gray-700">No fraud, abuse, or bots. Treat all users professionally.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">6</span>
                <div>
                  <span className="font-semibold text-blue-700">Ownership:</span>
                  <span className="ml-1 text-gray-700">You own your work. Platform content and code belong to SprintFlow.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">7</span>
                <div>
                  <span className="font-semibold text-blue-700">Safety:</span>
                  <span className="ml-1 text-gray-700">We use NDAs, encryption, and secure payments to protect you.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">8</span>
                <div>
                  <span className="font-semibold text-blue-700">Termination:</span>
                  <span className="ml-1 text-gray-700">Accounts violating these terms may be suspended.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 justify-center">
            {/* <MessageSquare className="w-4 h-4 text-blue-500" /> */}
            {/* <span>Questions? <span className="underline text-blue-600">support@yourdomain.com</span></span> */}
          </div>
        </div>
      ),
    },
    Security: {
      title: "Security",
      desc: (
        <>
          We employ industry-leading security measures, including NDA protection, encrypted communication, and secure payment gateways, ensuring your projects and data are always safe.
        </>
      ),
    },
    Support: {
      title: "Support",
      desc: (
        <>
          Need help? Our dedicated support team is here for you 24/7. Reach out via chat, email, or our help center for prompt assistance at every step of your journey.
          <div className="mt-3 text-sm text-blue-700 flex items-center gap-2">
            {/* <MessageSquare className="w-4 h-4" /> */}
            {/* <span>Contact: <a href="tel:8076626273" className="underline">8076626273</a></span> */}
            {/* Phone Number */}
            {/* Email */}
            <p className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              {(appConfig?.EMAIL?.split(',') || []).map((email, index) =>
                index === 0 ? (
                  <span key={index} className="text-gray-700">
                    {email.trim()}
                  </span>
                ) : null
              )}
            </p>


            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">{appConfig?.PHONE_NUMBER || "+91 98765 43210"}</span>
            </p>
          </div>
        </>
      ),
    },
  };

  // Animated Popup Modal
  const renderPopup = () => (
    <Dialog open={popupOpen} onClose={() => setPopupOpen(false)} className="fixed z-[100] inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={
          "relative bg-white rounded-2xl shadow-2xl w-full mx-4 p-6 " +
          (popupSection === "Terms" || popupSection === "Privacy"
            ? "max-w-3xl"
            : "max-w-lg")
        }
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 transition-colors"
          onClick={() => setPopupOpen(false)}
          aria-label="Close"
        >
          <svg width="24" height="24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
            <Sparkles size={22} />
          </span>
          <h2 className="text-2xl font-bold text-gray-900">{sectionContent[popupSection]?.title}</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-700 text-base leading-relaxed"
        >
          {sectionContent[popupSection]?.desc}
        </motion.div>
      </motion.div>
    </Dialog>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* {!isMobile && <CustomCursor />} */}
      {false && <CustomCursor />}



      {/* Hero Section - Improved responsiveness */}
      <motion.section
        className="hero-gradient relative overflow-hidden py-16 md:py-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div className="md:w-1/2 space-y-4 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="blue" className="mb-2 px-3 py-1.5 text-sm">✨ Connecting Talents Worldwide</Badge>
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {appConfig?.TAGLINE}
              </motion.h1>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 pt-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="group shadow-lg shadow-blue-500/20"
                  onClick={() => navigate('/company/login')}
                >
                  <span className="mr-2">{appConfig?.COMPANY_CTA ? appConfig?.COMPANY_CTA : 'Hire Developers'}</span>
                  <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                </Button>
                <Link to="/developer/login">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="shadow-md hover:shadow-lg transition-shadow"
                  >
                    {appConfig?.DEVELOPER_CTA ? appConfig?.DEVELOPER_CTA : 'Join as Developer'}
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="pt-5 flex justify-center md:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 ring-2 ring-white hover:ring-4 hover:ring-blue-500 hover:scale-110 transition-all duration-300 relative overflow-hidden group"
                        style={{
                          backgroundImage: `url(${getAvatarImage(i)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          zIndex: 10 - i
                        }}
                        whileHover={{ rotate: 10 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-blue-500 opacity-0 rounded-full group-hover:opacity-20 transition-opacity duration-300"
                        ></motion.div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div>
                    <div className="flex items-center">
                      <div className="text-yellow-500 flex">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                      <span className="ml-2 text-xs font-medium">4.9/5</span>
                    </div>
                    <p className="text-xs text-gray-600">From <span className="font-bold text-blue-600">2,000+</span> satisfied clients</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="md:w-1/2 relative w-full mt-8 md:mt-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative h-[280px] sm:h-[350px] md:h-[400px] w-full">
                {/* Main image with enhanced animation */}
                <div className="absolute inset-0 animate-float">
                  <div className="relative z-20 w-full h-full">
                    <img
                      src={image4}
                      alt="Developer working"
                      className="w-full h-full object-contain object-center"
                      loading="eager"
                    />
                  </div>

                  {/* Shadow effect */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-4/5 h-8 bg-blue-900/10 filter blur-xl rounded-full"></div>
                </div>

                {/* Floating elements with glass effect */}
                <AnimatePresence>
                  <motion.div
                    key="projects"
                    className="absolute -left-4 bottom-16 glass-effect p-3 rounded-xl shadow-blue flex items-center gap-2"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <Code className="text-blue-600" size={18} />
                    <span className="text-sm font-medium">25k+ Projects</span>
                  </motion.div>

                  <motion.div
                    key="countries"
                    className="absolute top-16 -right-2 glass-effect p-3 rounded-xl shadow-blue flex items-center gap-2"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <Globe className="text-blue-600" size={18} />
                    <span className="text-sm font-medium">100+ Countries</span>
                  </motion.div>

                  <motion.div
                    key="developers"
                    className="absolute top-1/2 left-0 glass-effect p-3 rounded-xl shadow-blue flex items-center gap-2"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <Users className="text-blue-600" size={18} />
                    <span className="text-sm font-medium">10k+ Developers</span>
                  </motion.div>
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Feature Cards Section - Improved visual design */}
      <div className="relative -mt-12 sm:-mt-24 z-20 px-4">
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
              <div className="relative bg-white backdrop-blur-sm rounded-xl p-6 shadow-xl border border-blue-100 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                      <ClipboardList size={22} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Post a Task & Get Matches</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">Create your project and get instantly matched with pre-vetted developers who perfectly align with your needs.</p>
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
              <div className="relative bg-white backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-100 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                      <Shield size={22} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">NDA Protected Environment</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">Your intellectual property is safe with our legally binding NDAs and secure development environment.</p>
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
              <div className="relative bg-white backdrop-blur-sm rounded-xl p-6 shadow-xl border border-emerald-100 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                      <Wallet size={22} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Escrow Payments</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">Secure milestone-based payments with no delays. Funds are safely held in escrow until work is approved.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modern CTA Section with Creative Design */}
      <ScrollTrigger>
        <section ref={ctaRef} className="py-20 mt-12 md:mt-24 relative overflow-hidden">
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
                <div className="text-center mb-16 md:mb-24 perspective-1000">
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
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
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
                      of<br className="sm:hidden" /> Freelance Collaboration
                    </h2>

                    {/* Animated Description */}
                    <motion.p
                      className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg px-4"
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
                <div className="relative space-y-24 md:space-y-32 px-4">
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

                  {/* Step 1: Company Search */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                      <div className="md:w-2/5 relative group">
                        <div className="relative rounded-xl shadow-2xl overflow-hidden bg-white">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
                          <div className="relative rounded-xl overflow-hidden p-1">
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <motion.img
                                src={image9}
                                alt="Company searching for developers"
                                className="w-full h-full object-fill transform group-hover:scale-110 transition-transform duration-700"
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

                  {/* Step 2: Developer Application */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
                      <div className="md:w-2/5 relative group">
                        <div className="relative rounded-xl shadow-2xl overflow-hidden bg-white">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
                          <div className="relative rounded-xl overflow-hidden p-1">
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <motion.img
                                src={image6}
                                alt="Developer applying for task"
                                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
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
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                      <div className="md:w-2/5 relative group">
                        <div className="relative rounded-xl shadow-2xl overflow-hidden bg-white">
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
                          <div className="relative rounded-xl overflow-hidden p-1">
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <motion.img
                                src={image2}
                                alt="Developer working"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
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
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
                      <div className="md:w-2/5 relative group">
                        <div className="relative rounded-xl shadow-2xl overflow-hidden bg-white">
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
                          <div className="relative rounded-xl overflow-hidden p-1">
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <motion.img
                                src={image1}
                                alt="Project completion"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
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
                  className="flex flex-col sm:flex-row gap-4 justify-center mt-16 md:mt-24"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-xl shadow-blue-500/20"
                    onClick={() => navigate('/company/login')}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <span className="mr-2">{appConfig?.COMPANY_CTA ? appConfig?.COMPANY_CTA : 'Post a Task'}</span>
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
                      className="group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-900 border-gray-200 shadow-lg"
                    >
                      <span className="relative z-10 flex items-center justify-center">

                        <span className="mr-2">{appConfig?.DEVELOPER_CTA ? appConfig?.DEVELOPER_CTA : 'Browse Tasks'}</span>
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
        </section>
      </ScrollTrigger>

      {/* Motion shapes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`particle-${i}`} // Changed to use a unique key with index
          className="absolute w-1 h-1 bg-white rounded-full opacity-0"
          style={{ left: `${20 + i * 15}%`, top: '50%' }}
          variants={{
            initial: { opacity: 0, y: 0, scale: 0 },
            hover: {
              opacity: [0, 0.5, 0],
              y: [0, -20 - i * 2],
              x: [0, (i - 2) * 5],
              scale: [0, 1 + i * 0.1, 0],
              transition: {
                repeat: Infinity,
                duration: 1 + i * 0.1,
                delay: i * 0.06,
              }
            }
          }}
        />
      ))}

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
                  <SocialLinks appConfig={appConfig}></SocialLinks>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-span-1 md:col-span-2">
                <h4 className="font-semibold mb-4">Company</h4>
                <nav className="flex flex-col space-y-3">
                  {['About', 'Services', 'contact'].map((item, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center group w-fit bg-transparent border-0 p-0"
                      whileHover={{ x: 4 }}
                      onClick={() => { setPopupSection(item); setPopupOpen(true); }}
                    >
                      <span className="relative">
                        {sectionContent[item]?.title}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 group-hover:w-full transition-all"></span>
                      </span>
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Legal Links */}
              <div className="col-span-1 md:col-span-2">
                <h4 className="font-semibold mb-4">Legal</h4>
                <nav className="flex flex-col space-y-3">
                  {['Privacy', 'Terms', 'Security', 'Support'].map((item, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center group w-fit bg-transparent border-0 p-0"
                      whileHover={{ x: 4 }}
                      onClick={() => { setPopupSection(item); setPopupOpen(true); }}
                    >
                      <span className="relative">
                        {item}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 group-hover:w-full transition-all"></span>
                      </span>
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Contact Form */}
              <div className="col-span-2 md:col-span-4">
                <h4 className="font-semibold mb-4">Get in Touch</h4>
                {/* <form
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
                </form> */}

                <FeedbackForm />

                <div className="mt-4 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {(appConfig?.EMAIL?.split(',') || []).map((email, index) => (
                      <span key={index}>{email.trim()}</span>
                    ))}
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
        {/* Popup Modal */}
        <AnimatePresence>
          {popupOpen && popupSection && renderPopup()}
        </AnimatePresence>
      </footer>

      {/* Back to top button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-white shadow-xl rounded-full hover:bg-blue-50 transition-colors text-blue-600 hover:text-blue-700"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      </motion.div>
    </div>
  );
}


<motion.div>
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className="p-3 bg-white shadow-xl rounded-full hover:bg-blue-50 transition-colors text-blue-600 hover:text-blue-700"
    aria-label="Back to top"
  >
    <ArrowUp size={20} />
  </button>
</motion.div>


export default Landing;

