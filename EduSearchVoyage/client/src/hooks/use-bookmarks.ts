import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Bookmark, InsertBookmark } from "@shared/schema";

export function useBookmarks(category?: string) {
  return useQuery<Bookmark[]>({
    queryKey: ["/api/bookmarks", category],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (category) {
        searchParams.set("category", category);
      }

      const response = await fetch(`/api/bookmarks?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }

      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useBookmarkCategories() {
  return useQuery<string[]>({
    queryKey: ["/api/bookmarks/categories"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkData: InsertBookmark) => {
      const response = await apiRequest("POST", "/api/bookmarks", bookmarkData);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all bookmark-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
    },
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkId: number) => {
      const response = await apiRequest("DELETE", `/api/bookmarks/${bookmarkId}`);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all bookmark-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
    },
  });
}
