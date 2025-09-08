import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, Users, Shield, Zap, Globe, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAppConfigWithCache } from '../api/configService';

const Services = () => {
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

  const companyCta = getConfigValue('COMPANY_CTA', 'Post a Project');
  const developerCta = getConfigValue('DEVELOPER_CTA', 'Browse Tasks');

  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Developer Matching",
      description: "Connect with top-tier developers who match your project requirements and company culture.",
      features: [
        "AI-powered matching algorithm",
        "Skills-based filtering",
        "Portfolio verification",
        "Cultural fit assessment"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Project Management",
      description: "Streamlined project management tools to ensure successful collaboration and delivery.",
      features: [
        "Real-time collaboration",
        "Progress tracking",
        "Milestone management",
        "Team communication tools"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Safe and reliable payment processing with escrow protection for all parties.",
      features: [
        "Escrow protection",
        "Milestone-based payments",
        "Secure transactions",
        "Dispute resolution"
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Rapid Deployment",
      description: "Get your projects started quickly with our streamlined onboarding process.",
      features: [
        "Quick setup process",
        "Pre-vetted talent",
        "Instant matching",
        "24/7 support"
      ]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Access to developers from around the world with diverse skills and expertise.",
      features: [
        "Worldwide talent pool",
        "Multiple time zones",
        "Cultural diversity",
        "Language support"
      ]
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Rigorous quality control processes to ensure high standards and client satisfaction.",
      features: [
        "Code review process",
        "Quality metrics",
        "Performance monitoring",
        "Continuous improvement"
      ]
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small projects and startups",
      features: [
        "Up to 3 active projects",
        "Basic matching algorithm",
        "Standard support",
        "Basic project management"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Unlimited projects",
        "Advanced matching algorithm",
        "Priority support",
        "Advanced analytics",
        "Custom integrations"
      ],
      buttonText: "Choose Plan",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom workflows",
        "API access",
        "On-premise deployment"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-2xl font-bold text-gray-900">Our Services</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Development Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide end-to-end services to connect talented developers with innovative projects, 
              ensuring successful collaborations and exceptional results.
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Pricing Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h3>
              <p className="text-lg text-gray-600">
                Choose the plan that fits your needs. No hidden fees, no surprises.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`bg-white p-8 rounded-lg shadow-sm ${
                    plan.popular ? 'ring-2 ring-blue-500 relative' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h4>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-600 ml-1">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div> */}

          {/* CTA Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-blue-600 rounded-lg p-12 text-center text-white"
          >
            <h3 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of companies and developers who trust CodeForContract for their projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/developer/signup"
                className="bg-white text-blue-600 py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                {developerCta}
              </Link>
              <Link
                to="/company/signup"
                className="border-2 border-white text-white py-3 px-8 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                {companyCta}
              </Link>
            </div>
          </motion.div> */}
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

export default Services;
