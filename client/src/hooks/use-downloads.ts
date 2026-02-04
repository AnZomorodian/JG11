import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type AnalyzeResponse, type HistoryResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// POST /api/analyze
export function useAnalyzeDownload() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch(api.downloads.analyze.path, {
        method: api.downloads.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400 || res.status === 500) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to analyze URL");
        }
        throw new Error("Failed to connect to server");
      }

      return api.downloads.analyze.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // Refresh history after a successful analysis since backend might save it
      queryClient.invalidateQueries({ queryKey: [api.downloads.history.path] });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// GET /api/history
export function useDownloadHistory() {
  return useQuery({
    queryKey: [api.downloads.history.path],
    queryFn: async () => {
      const res = await fetch(api.downloads.history.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.downloads.history.responses[200].parse(await res.json());
    },
  });
}
