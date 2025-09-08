import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MessageCircle, BookOpen, Phone, Mail, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAppConfigWithCache } from '../api/configService';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
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

  const emailList = getConfigValue('EMAIL', 'support@codeforcontract.com').split(',').map(email => email.trim());
  const phoneNumber = getConfigValue('PHONE_NUMBER', '+1 (555) 123-4567');

  const faqs = [
    {
      question: "How do I create a developer account?",
      answer: "To create a developer account, click on 'Sign Up' in the top right corner, select 'I'm a Developer', and fill out the registration form. You'll need to verify your email address and complete your profile to start applying for projects."
    },
    {
      question: "How do I post a project as a company?",
      answer: "After creating a company account, go to your dashboard and click 'Post New Project'. Fill in the project details, requirements, and budget. Our system will match you with suitable developers based on your criteria."
    },
    {
      question: "How does the payment system work?",
      answer: "We use an escrow system to protect both parties. Payments are held securely until project milestones are completed. You can release payments manually or set up automatic releases based on agreed milestones."
    },
    {
      question: "What if I'm not satisfied with the work?",
      answer: "We have a dispute resolution process in place. If you're not satisfied with the work, you can request revisions or file a dispute. Our support team will help mediate the situation and ensure a fair resolution."
    },
    {
      question: "How do I contact a developer before hiring?",
      answer: "You can message developers directly through our platform after they apply to your project."
    },
    {
      question: "Is there a fee for using the platform?",
      answer: "For Companies/Buyers, the platform is free to use. Developers/Sellers pay a small service fee (typically 3-5%) on successful project completions. There are no upfront costs or monthly fees for basic usage."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your dashboard and click on 'Profile Settings'. You can update your personal information, skills, portfolio, and preferences at any time. Changes are saved automatically."
    },
    {
      question: "What security measures are in place?",
      answer: "We use industry-standard encryption, secure payment processing, and regular security audits. All data is protected and we comply with international data protection regulations."
    }
  ];

  const supportCategories = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Documentation",
      description: "Comprehensive guides and tutorials",
      link: "#",
      color: "blue"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      link: "#",
      color: "green"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone Support",
      description: "Speak directly with our experts",
      link: "#",
      color: "purple"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description: "Send us a detailed message",
      link: "#",
      color: "orange"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
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
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Find answers to common questions or get in touch with our support team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </motion.div>

          {/* Support Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {supportCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`text-${category.color}-600 mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                {/* <div className={`text-${category.color}-600 text-sm font-medium`}>
                  Learn more →
                </div> */}
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">&lt; 2hrs</div>
              <div className="text-gray-600">Average Response Time</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h3>
              <p className="text-lg text-gray-600">
                Find quick answers to the most common questions
              </p>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-lg shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h4>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Support */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-blue-600 rounded-lg p-12 text-center text-white"
          >
            <h3 className="text-3xl font-bold mb-4">
              Still need help?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Our support team is here to help you succeed. Get in touch with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-600 py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
              <a
                href={`mailto:${emailList[0] || 'support@codeforcontract.com'}`}
                className="border-2 border-white text-white py-3 px-8 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                Email Us
              </a>
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

export default Support;
