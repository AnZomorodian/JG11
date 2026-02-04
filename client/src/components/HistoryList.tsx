import { useDownloadHistory } from "@/hooks/use-downloads";
import { formatDistanceToNow } from "date-fns";
import { Download, Film, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function HistoryList() {
  const { data: history, isLoading } = useDownloadHistory();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl bg-secondary/30 border border-dashed border-border">
        <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Clock className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">No recent downloads</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {history.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group relative bg-card hover:bg-card/80 border border-border rounded-xl p-4 transition-all hover:shadow-lg hover:border-primary/20 flex gap-4"
        >
          {/* Thumbnail */}
          <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-secondary">
            {item.thumbnail ? (
              <img src={item.thumbnail} alt={item.title || ""} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="w-6 h-6 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-sm truncate pr-6" title={item.title || "Untitled"}>
                {item.title || "Untitled Video"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {item.originalUrl}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-muted-foreground font-medium bg-secondary px-2 py-0.5 rounded-full">
                {item.createdAt && formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </span>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => window.open(item.originalUrl, '_blank')}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
