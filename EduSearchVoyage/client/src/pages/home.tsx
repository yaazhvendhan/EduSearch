import { useState } from "react";
import { SearchInterface } from "@/components/search-interface";
import { SearchResults } from "@/components/search-results";
import { BookmarkSidebar } from "@/components/bookmark-sidebar";
import { VoiceControls } from "@/components/voice-controls";
import { Button } from "@/components/ui/button";
import { useSearchHistory } from "@/hooks/use-search";
import { History, Bell, Settings } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const { data: searchHistory } = useSearchHistory();

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-dark-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-cyan-purple rounded-lg flex items-center justify-center animate-pulse-glow">
                <span className="text-white text-xl">🎓</span>
              </div>
              <h1 className="text-2xl font-bold text-gradient-cyan-purple">
                EduSearch
              </h1>
              <span className="text-sm text-slate-400 font-medium">Advanced Learning Platform</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" className="text-slate-300 hover:text-neon-cyan">
                🏠 Dashboard
              </Button>
              <Button variant="ghost" className="text-slate-300 hover:text-neon-cyan">
                📚 Bookmarks
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-300 hover:text-neon-cyan"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="ghost" className="text-slate-300 hover:text-neon-cyan">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </nav>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hover-glow">
                <Bell className="w-5 h-5 text-slate-300" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">ED</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6 animate-slide-in">
            <BookmarkSidebar />
            <VoiceControls />
            
            {/* Search History Panel */}
            {showHistory && (
              <div className="glass-effect rounded-xl p-6 neon-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold neon-emerald flex items-center">
                    <History className="w-5 h-5 mr-3" />
                    Recent Searches
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                  >
                    ✕
                  </Button>
                </div>
                <div className="space-y-2">
                  {searchHistory?.slice(0, 5).map((item) => (
                    <div 
                      key={item.id}
                      className="p-2 bg-dark-card rounded-lg hover-glow cursor-pointer"
                      onClick={() => setSearchQuery(item.query)}
                    >
                      <p className="text-sm text-slate-200 truncate">{item.query}</p>
                      <p className="text-xs text-slate-400">
                        {item.resultCount} results • {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {(!searchHistory || searchHistory.length === 0) && (
                    <p className="text-sm text-slate-400">No search history yet</p>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            <SearchInterface 
              onSearch={(query, filters) => {
                setSearchQuery(query);
                setSearchFilters(filters);
              }}
              initialQuery={searchQuery}
            />
            
            {searchQuery && (
              <SearchResults 
                query={searchQuery} 
                filters={searchFilters}
              />
            )}
          </main>
        </div>
      </div>

      {/* Floating History Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          size="icon"
          className="w-14 h-14 bg-gradient-cyan-purple rounded-full hover:scale-110 transition-transform shadow-lg"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
