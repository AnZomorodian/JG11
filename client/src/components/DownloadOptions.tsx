import { motion } from "framer-motion";
import { Download, Film, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalyzeResponse } from "@shared/routes";

interface DownloadOptionsProps {
  data: AnalyzeResponse;
  onReset: () => void;
}

export function DownloadOptions({ data, onReset }: DownloadOptionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto mt-12"
    >
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl shadow-black/5">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail Section */}
          <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto bg-black/5">
            {data.thumbnail ? (
              <img 
                src={data.thumbnail} 
                alt={data.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Film className="w-12 h-12 opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <Badge variant="secondary" className="bg-black/40 text-white backdrop-blur-md border-white/10">
                Ready for Download
              </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 p-6 md:p-8 flex flex-col">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2 line-clamp-2">
              {data.title}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Securely analyzed</span>
            </div>

            <div className="flex-grow">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Available Formats
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.formats.map((format, idx) => (
                  <a
                    key={idx}
                    href={format.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {format.label || format.quality || 'Standard'}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {format.ext}
                      </span>
                    </div>
                    <Button size="icon" variant="ghost" className="text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </Button>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-end">
              <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground">
                Analyze Another Video
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
