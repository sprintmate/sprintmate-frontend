import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Calendar, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAppConfigWithCache } from '../api/configService';

const TermsAndConditions = () => {
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

  const fromEmail = getConfigValue('FROM_EMAIL', 'legal@codeforcontract.com');

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using CodeForContract, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily download one copy of CodeForContract per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on the website; or remove any copyright or other proprietary notations from the materials."
    },
    {
      title: "3. User Accounts",
      content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account. You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account."
    },
    {
      title: "4. Prohibited Uses",
      content: "You may not use our service: for any unlawful purpose or to solicit others to perform unlawful acts; to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances; to infringe upon or violate our intellectual property rights or the intellectual property rights of others; to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate; to submit false or misleading information; to upload or transmit viruses or any other type of malicious code."
    },
    {
      title: "5. Content",
      content: "Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the service, including its legality, reliability, and appropriateness. By posting content to the service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the service."
    },
    {
      title: "6. Payment Terms",
      content: "For services requiring payment, you agree to pay all charges or fees at the prices then in effect for your purchases. You agree to pay all charges incurred by users of your credit card, debit card, or other payment method used in connection with a purchase or transaction. We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment."
    },
    {
      title: "7. Privacy Policy",
      content: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices. By using our service, you agree to the collection and use of information in accordance with this policy."
    },
    {
      title: "8. Termination",
      content: "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the service."
    },
    {
      title: "9. Disclaimer",
      content: "The information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, this Company: excludes all representations and warranties relating to this website and its contents; excludes all liability for damages arising out of or in connection with your use of this website."
    },
    {
      title: "10. Governing Law",
      content: "These Terms shall be interpreted and governed by the laws of the State of California, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
    },
    {
      title: "11. Changes to Terms",
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion."
    },
    {
      title: "12. Contact Information",
      content: `If you have any questions about these Terms and Conditions, please contact us at ${fromEmail} or through our contact page.`
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
            <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
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
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our service.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Legally binding
              </div>
            </div>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-12"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Important Notice</h3>
                <p className="text-amber-700 text-sm">
                  These terms constitute a legally binding agreement between you and CodeForContract. 
                  By using our service, you acknowledge that you have read, understood, and agree to be bound by these terms.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Terms Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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
                <p className="text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Summary
            </h3>
            <p className="text-gray-600 mb-4">
              These terms outline the rules and regulations for the use of CodeForContract's website and services. 
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use 
              CodeForContract if you do not agree to take all of the terms and conditions stated on this page.
            </p>
            <div className="text-sm text-gray-500">
              <p>
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                <strong>Version:</strong> 1.0
              </p>
            </div>
          </motion.div>

          {/* Contact for Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Questions About These Terms?
            </h3>
            <p className="text-gray-600 mb-6">
              If you have any questions about these Terms and Conditions, please don't hesitate to contact us.
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
                Email Legal Team
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

export default TermsAndConditions;
