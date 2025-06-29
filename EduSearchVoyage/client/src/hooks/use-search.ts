import { useQuery } from "@tanstack/react-query";
import type { SearchResponse, SearchHistory } from "@shared/schema";

export function useSearch(query: string, filters: any = {}, startIndex: number = 1) {
  return useQuery<SearchResponse>({
    queryKey: ["/api/search", query, filters, startIndex],
    queryFn: async () => {
      if (!query.trim()) {
        throw new Error("Search query is required");
      }

      const searchParams = new URLSearchParams({
        q: query,
        start: startIndex.toString(),
        num: "10"
      });

      if (filters.timeRange && filters.timeRange !== "any") {
        searchParams.set("dateRestrict", filters.timeRange);
      }

      if (filters.source && filters.source !== "all") {
        // Map source filters to site searches
        const siteMap: Record<string, string> = {
          academic: "edu",
          videos: "youtube.com",
          tutorials: "tutorial",
          reference: "reference"
        };
        if (siteMap[filters.source]) {
          searchParams.set("siteSearch", siteMap[filters.source]);
        }
      }

      const response = await fetch(`/api/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `Search failed: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.message.includes('400') || error.message.includes('401') || error.message.includes('403')) {
        return false;
      }
      return failureCount < 2;
    }
  });
}

export function useSearchHistory(limit?: number) {
  return useQuery<SearchHistory[]>({
    queryKey: ["/api/search-history", limit],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (limit) {
        searchParams.set("limit", limit.toString());
      }

      const response = await fetch(`/api/search-history?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch search history");
      }

      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}
