import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

export function VoiceControls() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if the Omnidimension widget is loaded
    const checkWidget = () => {
      if (window.omnidimensionWidget) {
        setIsSupported(true);
      } else {
        // Fallback to check for browser speech recognition
        setIsSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
      }
    };

    checkWidget();
    
    // Check periodically for the widget to load
    const interval = setInterval(checkWidget, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    try {
      // Try to use Omnidimension widget first
      if (window.omnidimensionWidget && window.omnidimensionWidget.startVoiceRecognition) {
        window.omnidimensionWidget.startVoiceRecognition();
        setIsListening(true);
        return;
      }

      // Fallback to browser speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice command:', transcript);
          
          // Trigger search with voice input
          const searchEvent = new CustomEvent('voiceSearch', { 
            detail: { query: transcript } 
          });
          window.dispatchEvent(searchEvent);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    try {
      // Try to stop Omnidimension widget
      if (window.omnidimensionWidget && window.omnidimensionWidget.stopVoiceRecognition) {
        window.omnidimensionWidget.stopVoiceRecognition();
      }
      
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
      setIsListening(false);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 neon-border">
      <h3 className="text-lg font-semibold neon-emerald mb-4 flex items-center">
        <Mic className="w-5 h-5 mr-3" />
        Voice Assistant
      </h3>
      
      <div className="text-center">
        <Button
          onClick={toggleVoiceRecognition}
          disabled={!isSupported}
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse-glow' 
              : 'bg-gradient-cyan-emerald hover:scale-110'
          } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </Button>
        
        <p className="text-sm text-slate-400 mt-3">
          {isListening 
            ? "Listening... Speak your search query"
            : isSupported 
              ? "Click to activate voice search"
              : "Voice search not available"
          }
        </p>
        
        {isSupported && (
          <div className="mt-4 text-xs text-slate-500 space-y-1">
            <p>💡 Say: "Search for quantum mechanics"</p>
            <p>💡 Say: "Show my bookmarks"</p>
            <p>💡 Say: "Find machine learning tutorials"</p>
          </div>
        )}
        
        {!isSupported && (
          <div className="mt-4 text-xs text-slate-500">
            <p>Voice features require microphone permissions</p>
          </div>
        )}
      </div>
    </div>
  );
}
