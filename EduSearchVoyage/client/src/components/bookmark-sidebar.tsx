import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBookmarks, useBookmarkCategories, useDeleteBookmark } from "@/hooks/use-bookmarks";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, Plus, Trash2, ExternalLink } from "lucide-react";

export function BookmarkSidebar() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { data: bookmarks, isLoading } = useBookmarks(selectedCategory === "all" ? undefined : selectedCategory);
  const { data: categories } = useBookmarkCategories();
  const deleteBookmark = useDeleteBookmark();
  const { toast } = useToast();

  const handleDeleteBookmark = async (id: number) => {
    try {
      await deleteBookmark.mutateAsync(id);
      toast({
        title: "Bookmark deleted",
        description: "The bookmark has been removed from your collection.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bookmark. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <div className="glass-effect rounded-xl p-6 neon-border">
        <h3 className="text-lg font-semibold neon-cyan mb-4 flex items-center">
          📚 Categories
        </h3>
        <div className="space-y-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full bg-dark-card border-dark-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {categories?.map((category) => {
            const categoryCount = bookmarks?.filter(b => b.category === category).length || 0;
            return (
              <label key={category} className="flex items-center cursor-pointer group">
                <input 
                  type="radio" 
                  name="category"
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                  className="mr-3 accent-neon-cyan" 
                />
                <span className="group-hover:text-neon-cyan transition-colors flex-1">
                  {category}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {categoryCount}
                </Badge>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bookmarks Panel */}
      <div className="glass-effect rounded-xl p-6 neon-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold neon-purple flex items-center">
            <Bookmark className="w-5 h-5 mr-3" />
            Bookmarks
          </h3>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-neon-purple hover:text-purple-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 bg-dark-card rounded-lg animate-pulse">
                  <div className="h-4 bg-slate-600 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : bookmarks && bookmarks.length > 0 ? (
            bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="p-3 bg-dark-card rounded-lg hover-glow group">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-slate-200 truncate group-hover:text-neon-cyan transition-colors">
                      <a 
                        href={bookmark.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        {bookmark.title}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </a>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {bookmark.category} • {formatDate(bookmark.createdAt)}
                    </p>
                    {bookmark.snippet && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {bookmark.snippet}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBookmark(bookmark.id)}
                    disabled={deleteBookmark.isPending}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-400 ml-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Bookmark className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">
                {selectedCategory === "all" ? "No bookmarks yet" : `No bookmarks in ${selectedCategory}`}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Search for topics and bookmark interesting results
              </p>
            </div>
          )}
        </div>
        
        {bookmarks && bookmarks.length > 0 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 py-2 text-sm text-neon-purple hover:bg-dark-card rounded-lg transition-colors"
          >
            View All Bookmarks
          </Button>
        )}
      </div>
    </div>
  );
}
