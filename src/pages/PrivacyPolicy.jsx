import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAppConfigWithCache } from '../api/configService';

const PrivacyPolicy = () => {
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

  const fromEmail = getConfigValue('FROM_EMAIL', 'privacy@codeforcontract.com');

  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, complete your profile, apply for projects, or communicate with us. This may include:",
      subsections: [
        "Personal information (name, email address, phone number)",
        "Professional information (skills, experience, portfolio)",
        "Payment information (processed securely through third-party providers)",
        "Developer payout information (bank account details for withdrawals)",
        "Buyer payment method data for escrow and checkout (handled by PCI-compliant processors)",
        "Communication data (messages, feedback, support requests)",
        "Usage data (how you interact with our platform)"
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the information we collect to:",
      subsections: [
        "Provide, maintain, and improve our services",
        "Match developers with relevant projects",
        "Process transactions (including escrow), payouts, and send related information",
        "Send technical notices, updates, and support messages",
        "Respond to your comments and questions",
        "Monitor and analyze trends and usage",
        "Personalize and improve your experience"
      ]
    },
    {
      title: "3. Information Sharing and Disclosure",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:",
      subsections: [
        "With your explicit consent",
        "To service providers who assist us in operating our platform",
        "When required by law or to protect our rights",
        "In connection with a business transfer or acquisition",
        "To prevent fraud or security threats"
      ]
    },
    {
      title: "4. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:",
      subsections: [
        "Encryption of data in transit and at rest",
        "Regular security assessments and updates",
        "Access controls and authentication measures",
        "Employee training on data protection",
        "Incident response procedures"
      ]
    },
    {
      title: "5. Your Rights and Choices",
      content: "You have certain rights regarding your personal information:",
      subsections: [
        "Access: Request a copy of your personal data",
        "Rectification: Correct inaccurate or incomplete data",
        "Erasure: Request deletion of your personal data",
        "Portability: Receive your data in a structured format",
        "Objection: Object to certain processing activities",
        "Withdrawal: Withdraw consent at any time"
      ]
    },
    {
      title: "6. Cookies and Tracking Technologies",
      content: "We use cookies and similar tracking technologies to enhance your experience on our platform. These help us:",
      subsections: [
        "Remember your preferences and settings",
        "Analyze how you use our platform",
        "Provide personalized content and features",
        "Improve our services and user experience"
      ]
    },
    {
      title: "7. Data Retention",
      content: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. We will delete or anonymize your data when it is no longer needed."
    },
    {
      title: "8. International Data Transfers",
      content: "Your information may be transferred to and processed in countries other than your own. We ensure that such transfers are subject to appropriate safeguards and that your data is protected in accordance with applicable data protection laws."
    },
    {
      title: "9. Children's Privacy",
      content: "Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete such information."
    },
    {
      title: "10. Changes to This Policy",
      content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last Updated' date. We encourage you to review this policy periodically for any changes."
    },
    {
      title: "11. Contact Us",
      content: `If you have any questions about this privacy policy or our data practices, please contact us at ${fromEmail} or through our contact page. We are committed to addressing your concerns and protecting your privacy.`
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
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Transparent practices
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Secure data handling
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                User-focused
              </div>
            </div>
          </motion.div>

          {/* Key Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Database className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Minimal Data Collection</h3>
              <p className="text-sm text-gray-600">We only collect what's necessary to provide our services effectively.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Lock className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Strong Security</h3>
              <p className="text-sm text-gray-600">Your data is protected with industry-standard security measures.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Globe className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Global Compliance</h3>
              <p className="text-sm text-gray-600">We comply with international data protection regulations.</p>
            </div>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Your Privacy Matters</h3>
                <p className="text-blue-700 text-sm">
                  We are committed to protecting your privacy and being transparent about our data practices. 
                  This policy explains what information we collect, how we use it, and your rights regarding your data.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-8"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-lg p-8 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {section.content}
                </p>
                {section.subsections && (
                  <ul className="space-y-2">
                    {section.subsections.map((subsection, subIndex) => (
                      <li key={subIndex} className="flex items-start text-gray-600">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {subsection}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Data Rights Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 bg-green-50 border border-green-200 rounded-lg p-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Your Data Rights Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">You Can:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Access your personal data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Delete your account and data</li>
                  <li>• Export your data</li>
                  <li>• Object to certain processing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">We Promise:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Never sell your data</li>
                  <li>• Use data only as described</li>
                  <li>• Keep your data secure</li>
                  <li>• Be transparent about practices</li>
                  <li>• Respect your choices</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Contact for Privacy Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-12 text-center"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Questions About Your Privacy?
            </h3>
            <p className="text-gray-600 mb-6">
              If you have any questions about this privacy policy or want to exercise your data rights, 
              please contact our privacy team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </Link>
              <a
                href={`mailto:${fromEmail}`}
                className="border border-blue-600 text-blue-600 py-3 px-8 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Email Privacy Team
              </a>
            </div>
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

export default PrivacyPolicy;
