import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Target, Award, Globe, Heart, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAppConfigWithCache } from '../api/configService';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

const AboutUs = () => {
  const [appConfig, setAppConfig] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchAppConfigWithCache();
        setAppConfig(config);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };
    loadConfig();
  }, []);

  // Get config values with fallbacks
  const getConfigValue = (key, fallback = '') => {
    return appConfig?.config?.[key] || fallback;
  };

  const tagline = getConfigValue('TAGLINE', 'Transform your development workflow with our elite talent network');

  const stats = [
    { number: "10+", label: "Active Developers" },
    { number: "5+", label: "Completed Projects" },
    { number: "98%", label: "Client Satisfaction" }
    // { number: "50+", label: "Countries Served" }
  ];

  const values = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Quality First",
      description: "We ensure every task is completed to the highest standards by vetted professionals."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Efficiency",
      description: "Streamlined processes that help you delegate tasks quickly and track progress effectively."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Security",
      description: "Secure platform with transparent processes and protected transactions."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Reliability",
      description: "Consistent delivery of quality work on time, every time."
    }
  ];


  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://codeforcontract.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About Us",
        "item": "https://codeforcontract.com/about"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="About CodeForContract - Leading Freelance Software Engineers Marketplace"
        description="Learn about CodeForContract, the premier platform connecting companies with top-tier freelance software engineers and developers. Discover our mission, values, and commitment to quality."
        keywords="about codeforcontract, freelance marketplace, software engineers, company story, mission, values, quality developers"
        canonical="/about"
        structuredData={breadcrumbSchema}
      />
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">About Us</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={[{ name: 'About Us', path: '/about' }]} />
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              About CodeForContract
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {tagline}
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Our Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    CodeForContract was born from the need to simplify project management and 
                    task delegation. We recognized that many businesses struggle with 
                    finding the right talent for specific tasks and managing projects 
                    efficiently.
                  </p>
                  <p>
                    Our platform connects businesses with skilled professionals who can 
                    deliver high-quality work on time. Whether you need a quick task 
                    completed or a complex project managed, CodeForContract provides the tools 
                    and talent to get it done.
                  </p>
                  <p>
                    We believe in the power of delegation and the importance of delivering 
                    results. Our platform makes it easy to post tasks, find the right 
                    professionals, and track progress from start to finish.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white">
                <div className="text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold mb-4">Our Mission</h4>
                  <p className="text-lg opacity-90">
                    Making task delegation simple and efficient, connecting businesses 
                    with skilled professionals to deliver exceptional results.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Our Values
              </h3>
              <p className="text-lg text-gray-600">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="text-blue-600 mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h4>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>


          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-blue-600 rounded-lg p-12 text-center text-white"
          >
            <TrendingUp className="w-16 h-16 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">
              Why Choose CodeForContract?
            </h3>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We simplify the process of finding and working with skilled professionals. 
              Our platform ensures quality delivery, transparent communication, and 
              successful project completion every time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} CodeForContract. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
