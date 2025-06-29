import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Search } from "lucide-react";

interface SearchInterfaceProps {
  onSearch: (query: string, filters: any) => void;
  initialQuery?: string;
}

export function SearchInterface({ onSearch, initialQuery = "" }: SearchInterfaceProps) {
  const [query, setQuery] = useState(initialQuery);
  const [source, setSource] = useState("all");
  const [timeRange, setTimeRange] = useState("any");
  const [level, setLevel] = useState("all");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, { source, timeRange, level });
    }
  };

  const handleVoiceSearch = () => {
    // This will trigger the Omnidimension voice widget
    if (window.speechRecognition) {
      window.speechRecognition.start();
    } else {
      console.log("Voice search would trigger Omnidimension widget");
    }
  };

  const quickSearches = [
    "Quantum Computing",
    "Neural Networks", 
    "Climate Change",
    "Ancient Civilizations",
    "Machine Learning",
    "Biochemistry"
  ];

  return (
    <div className="glass-effect rounded-2xl p-8 neon-border">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gradient-cyan-purple mb-3">
          Advanced Educational Search
        </h2>
        <p className="text-slate-400 text-lg">
          Discover knowledge with voice commands and intelligent search
        </p>
      </div>

      {/* Search Form */}
      <div className="relative mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for topics, concepts, or questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-6 py-4 bg-dark-card border-dark-border text-lg focus:border-neon-cyan focus:ring-neon-cyan/20 transition-all duration-300"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceSearch}
              className="text-slate-400 hover:text-neon-cyan transition-colors"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleSearch}
              className="px-6 py-2 bg-gradient-cyan-purple rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-48 bg-dark-card border-dark-border focus:border-neon-cyan">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="academic">Academic Papers</SelectItem>
            <SelectItem value="videos">Educational Videos</SelectItem>
            <SelectItem value="tutorials">Interactive Tutorials</SelectItem>
            <SelectItem value="reference">Reference Materials</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48 bg-dark-card border-dark-border focus:border-neon-cyan">
            <SelectValue placeholder="Any Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Time</SelectItem>
            <SelectItem value="h">Past Hour</SelectItem>
            <SelectItem value="d">Past Day</SelectItem>
            <SelectItem value="w">Past Week</SelectItem>
            <SelectItem value="m">Past Month</SelectItem>
          </SelectContent>
        </Select>

        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-48 bg-dark-card border-dark-border focus:border-neon-cyan">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Topic Suggestions */}
      <div className="flex flex-wrap gap-3">
        <span className="text-sm text-slate-400 mr-2">Quick searches:</span>
        {quickSearches.map((topic) => (
          <Button
            key={topic}
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery(topic);
              onSearch(topic, { source, timeRange, level });
            }}
            className="px-3 py-1 bg-dark-card border-dark-border rounded-full text-sm hover:border-neon-cyan hover:text-neon-cyan transition-colors"
          >
            {topic}
          </Button>
        ))}
      </div>
    </div>
  );
}
