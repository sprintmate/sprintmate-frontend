import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

const Blog = () => {
  const blogPosts = [
    {
      id: 'top-10-freelance-software-engineer-skills-2025',
      title: 'Top 10 Freelance Software Engineering Skills in 2025: A Complete Guide',
      excerpt: 'Discover the most in-demand skills that freelance software engineers need to master in 2025 to stay competitive and command premium rates in the evolving tech landscape.',
      author: 'CodeForContract Team',
      date: '2025-01-20',
      readTime: '12 min read',
      image: '/assets/blog/skills-2025.jpg',
      category: 'Career Development'
    },
    {
      id: 'how-to-outsource-sprint-spillovers-without-delays',
      title: 'How to Outsource Sprint Spillovers Without Delays: A Complete Guide',
      excerpt: 'Learn proven strategies for managing sprint spillovers by leveraging freelance developers to maintain project momentum, meet deadlines, and deliver quality results without compromising your timeline.',
      author: 'CodeForContract Team',
      date: '2025-01-18',
      readTime: '10 min read',
      image: '/assets/blog/sprint-spillovers.jpg',
      category: 'Project Management'
    },
    {
      id: 'why-startups-choose-freelance-developers-fast-growth',
      title: 'Why Startups Choose Freelance Developers for Fast Growth: The Complete Strategic Guide',
      excerpt: 'Discover how successful startups leverage freelance developers to accelerate growth, reduce costs, and access specialized talent while maintaining flexibility in today\'s competitive market.',
      author: 'CodeForContract Team',
      date: '2025-01-15',
      readTime: '14 min read',
      image: '/assets/blog/startup-growth.jpg',
      category: 'Startup Insights'
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
        "name": "Blog",
        "item": "https://codeforcontract.com/blog"
      }
    ]
  };

  // Blog Schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CodeForContract Blog",
    "description": "Insights, tips, and success stories from the world of freelance development and remote work",
    "url": "https://codeforcontract.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "CodeForContract",
      "url": "https://codeforcontract.com"
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://codeforcontract.com/blog/${post.id}`,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "CodeForContract"
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Blog - Freelance Development Insights & Tips | CodeForContract"
        description="Stay updated with the latest insights, tips, and success stories from the world of freelance development, remote work, and digital transformation. Expert advice for developers and companies."
        keywords="freelance development blog, software engineering tips, remote work insights, developer skills, project management, startup growth"
        canonical="/blog"
        structuredData={[breadcrumbSchema, blogSchema]}
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
            <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={[{ name: 'Blog', path: '/blog' }]} />
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Insights & Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the latest trends, tips, and insights from the world of freelance development, 
              remote work, and digital transformation.
            </p>
          </motion.div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:border-blue-200"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="text-6xl relative z-10 filter drop-shadow-lg">
                    {post.category === 'Career Development' ? '🎯' : 
                     post.category === 'Project Management' ? '⚡' : '🚀'}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group-hover:gap-3"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter Signup */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-4">
              Stay Updated
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Get the latest insights and tips delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
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

export default Blog;
