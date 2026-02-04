import { useState } from "react";
import { ArrowRight, Link2, Loader2 } from "lucide-react";
import { useAnalyzeDownload } from "@/hooks/use-downloads";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AnalyzeFormProps {
  onSuccess: (data: any) => void;
}

export function AnalyzeForm({ onSuccess }: AnalyzeFormProps) {
  const [url, setUrl] = useState("");
  const analyze = useAnalyzeDownload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    analyze.mutate(url, {
      onSuccess: (data) => onSuccess(data),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-2 md:p-3 rounded-2xl shadow-xl shadow-primary/5 border-primary/10 bg-card">
        <form onSubmit={handleSubmit} className="relative flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Link2 className="w-5 h-5" />
            </div>
            <Input
              type="url"
              placeholder="Paste video URL here (VK, OK.ru, etc)..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12 md:h-14 text-base md:text-lg border-transparent bg-secondary/50 focus:bg-background rounded-xl input-ring"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={analyze.isPending || !url.trim()}
            className="h-12 md:h-14 px-8 rounded-xl font-semibold text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
          >
            {analyze.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <span className="flex items-center gap-2">
                Analyze
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>
      </Card>

      <AnimatePresence>
        {analyze.error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium text-center border border-destructive/20"
          >
            {analyze.error.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
