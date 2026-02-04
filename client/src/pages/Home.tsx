import { useState } from "react";
import { Header } from "@/components/Header";
import { AnalyzeForm } from "@/components/AnalyzeForm";
import { DownloadOptions } from "@/components/DownloadOptions";
import { HistoryList } from "@/components/HistoryList";
import type { AnalyzeResponse } from "@shared/routes";
import { motion } from "framer-motion";

export default function Home() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-16"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-2">
              Supports VK, OK.ru & More
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-foreground">
              Download Videos <br/>
              <span className="text-gradient">Without Limits</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The fastest way to download videos from your favorite social networks. 
              Just paste the link and choose your quality.
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div variants={itemVariants} className="z-10 relative">
            {!result ? (
              <AnalyzeForm onSuccess={setResult} />
            ) : (
              <DownloadOptions data={result} onReset={() => setResult(null)} />
            )}
          </motion.div>

          {/* Features Grid */}
          {!result && (
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-border/50"
            >
              <FeatureItem 
                title="Lightning Fast" 
                description="Our advanced algorithms fetch video metadata in milliseconds."
              />
              <FeatureItem 
                title="Best Quality" 
                description="Download in 1080p, 4K, or whatever source quality is available."
              />
              <FeatureItem 
                title="Completely Free" 
                description="No hidden fees, no registration required. Just simple downloads."
              />
            </motion.div>
          )}

          {/* Recent History */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-foreground">
                Recent Downloads
              </h3>
            </div>
            <HistoryList />
          </motion.div>
        </motion.div>
      </main>

      <footer className="py-8 border-t border-border/40 bg-background/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FastLoad. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="text-center space-y-2 p-4">
      <h3 className="font-bold text-foreground text-lg">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
