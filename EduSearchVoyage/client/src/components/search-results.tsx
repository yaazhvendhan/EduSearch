import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@/hooks/use-search";
import { useCreateBookmark } from "@/hooks/use-bookmarks";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, Share, Eye, Clock, Star, ExternalLink, BookmarkCheck } from "lucide-react";
import type { SearchResult } from "@shared/schema";

interface SearchResultsProps {
  query: string;
  filters: any;
}

export function SearchResults({ query, filters }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState("relevance");
  const [startIndex, setStartIndex] = useState(1);
  const { data: searchResponse, isLoading, error } = useSearch(query, filters, startIndex);
  const createBookmark = useCreateBookmark();
  const { toast } = useToast();

  const handleBookmark = async (result: SearchResult) => {
    try {
      await createBookmark.mutateAsync({
        title: result.title,
        url: result.link,
        description: result.snippet,
        category: "Search Results",
        snippet: result.snippet,
        source: result.displayLink,
        userId: 1 // Default user ID
      });
      
      toast({
        title: "Bookmark saved!",
        description: `Added "${result.title}" to your bookmarks.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save bookmark. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = (result: SearchResult) => {
    if (navigator.share) {
      navigator.share({
        title: result.title,
        text: result.snippet,
        url: result.link,
      });
    } else {
      navigator.clipboard.writeText(result.link);
      toast({
        title: "Link copied!",
        description: "The result link has been copied to your clipboard.",
      });
    }
  };

  const getSourceType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return { type: 'Video', color: 'neon-purple' };
    if (url.includes('edu') || url.includes('academic')) return { type: 'Academic', color: 'neon-cyan' };
    if (url.includes('interactive') || url.includes('simulation')) return { type: 'Interactive', color: 'neon-emerald' };
    return { type: 'Article', color: 'slate' };
  };

  const loadMoreResults = () => {
    setStartIndex(prev => prev + 10);
  };

  if (error) {
    return (
      <div className="glass-effect rounded-xl p-8 neon-border">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">Search Error</h3>
          <p className="text-slate-300 mb-4">
            {error.message || "Failed to perform search. Please check your internet connection and try again."}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-cyan-purple hover:scale-105 transition-transform"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-200">Search Results</h3>
        <div className="flex items-center space-x-4">
          {searchResponse && (
            <span className="text-sm text-slate-400">
              {searchResponse.searchInformation?.formattedTotalResults || '0'} results found
            </span>
          )}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-dark-card border-dark-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="source">Source Quality</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="search-result-card rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {searchResponse?.items?.map((result, index) => {
            const sourceType = getSourceType(result.link);
            return (
              <div key={`${result.cacheId}-${index}`} className="search-result-card rounded-xl p-6 hover-glow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant="secondary"
                        className={`px-2 py-1 text-xs rounded-full ${
                          sourceType.color === 'neon-cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                          sourceType.color === 'neon-purple' ? 'bg-purple-500/20 text-purple-400' :
                          sourceType.color === 'neon-emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {sourceType.type}
                      </Badge>
                      <span className="text-slate-500 text-sm">{result.displayLink}</span>
                    </div>
                    <h4 className="text-xl font-semibold text-slate-100 mb-2 hover:text-neon-cyan transition-colors cursor-pointer">
                      <a 
                        href={result.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        {result.title}
                        <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
                      </a>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      {result.snippet}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        Educational Resource
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Quick access
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        Verified content
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleBookmark(result)}
                      disabled={createBookmark.isPending}
                      className="bookmark-btn text-slate-400 hover:text-yellow-400 transition-colors"
                    >
                      {createBookmark.isPending ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare(result)}
                      className="text-slate-400 hover:text-neon-cyan transition-colors"
                    >
                      <Share className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    asChild
                    className={`px-4 py-2 rounded-lg text-sm hover:scale-105 transition-transform ${
                      sourceType.color === 'neon-cyan' ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' :
                      sourceType.color === 'neon-purple' ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' :
                      sourceType.color === 'neon-emerald' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' :
                      'bg-slate-500/20 text-slate-400 hover:bg-slate-500/30'
                    }`}
                  >
                    <a href={result.link} target="_blank" rel="noopener noreferrer">
                      View Resource
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-4 py-2 bg-dark-card border-dark-border text-slate-300 rounded-lg text-sm hover:border-neon-cyan transition-colors"
                  >
                    Related Topics
                  </Button>
                </div>
              </div>
            );
          })}

          {searchResponse?.items && searchResponse.items.length > 0 && (
            <div className="text-center py-8">
              <Button
                onClick={loadMoreResults}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-cyan-purple rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                {isLoading ? "Loading..." : "Load More Results"}
              </Button>
            </div>
          )}

          {searchResponse && (!searchResponse.items || searchResponse.items.length === 0) && (
            <div className="glass-effect rounded-xl p-8 neon-border text-center">
              <div className="text-slate-400 text-xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-200 mb-2">No Results Found</h3>
              <p className="text-slate-400">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
