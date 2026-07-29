"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Upload, FileDown, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent-light)] opacity-20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400 opacity-20 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl w-full mx-auto z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[var(--color-accent)]" />
          <span className="font-bold text-xl tracking-tight">CatalogueAI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="bg-[var(--color-primary)] text-[var(--color-surface)] dark:bg-[var(--color-surface)] dark:text-[var(--color-primary)] px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
            Go to Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 z-10">
        <motion.div 
          className="max-w-4xl w-full text-center space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Gemini AI</span>
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Generate Product Catalogues <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-purple-500">
              with AI
            </span>
          </motion.h1>
          
          <motion.p variants={item} className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
            Upload product images, let Gemini AI analyze them, and get structured catalogue entries in seconds. Perfect for e-commerce stores.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/dashboard" 
              className="group flex items-center justify-center gap-2 bg-[var(--color-accent)] text-white px-8 py-4 rounded-full font-semibold hover:bg-[var(--color-accent-hover)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#features" 
              className="flex items-center justify-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-8 py-4 rounded-full font-semibold hover:bg-[var(--color-surface-hover)] transition-colors w-full sm:w-auto"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          id="features"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Feature 1 */}
          <motion.div variants={item} className="bg-[var(--color-surface)]/80 backdrop-blur-md p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">1. Upload Images</h3>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Drag & drop or browse to upload product images in JPG, PNG, or WEBP format. We support bulk uploads.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={item} className="bg-[var(--color-surface)]/80 backdrop-blur-md p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">2. AI Analysis</h3>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Gemini Vision AI extracts product name, description, materials, pricing, SEO keywords, and more with high accuracy.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={item} className="bg-[var(--color-surface)]/80 backdrop-blur-md p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
              <FileDown className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Export Catalogue</h3>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Download your generated catalogue as CSV, Excel, or JSON, ready to import into Shopify, WooCommerce, or any platform.
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-[var(--color-muted)] z-10 text-sm">
        <p>Built with ❤️ and Gemini AI</p>
      </footer>
    </div>
  );
}
