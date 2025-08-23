import React, { useState } from 'react';
import { Copy, Info, Heart, Target, AlertTriangle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  speaker: string;
  text: string;
  timestamp?: string;
  isUser?: boolean;
}

interface Highlight {
  id: string;
  messageId: string;
  startIndex: number;
  endIndex: number;
  type: 'bid' | 'response-toward' | 'response-away' | 'response-against' | 'opportunity' | 'concern';
  category: string;
  explanation: string;
  suggestion?: string;
  originalText: string;
}

interface InteractiveConversationProps {
  messages: Message[];
  highlights: Highlight[];
  suggestions?: any[];
}

const InteractiveConversation = ({ messages, highlights, suggestions = [] }: InteractiveConversationProps) => {
  const [hoveredHighlight, setHoveredHighlight] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Debug logging
  console.log('InteractiveConversation - Messages:', messages);
  console.log('InteractiveConversation - Highlights:', highlights);
  console.log('InteractiveConversation - Suggestions:', suggestions);

  const getHighlightColor = (type: string) => {
    switch (type) {
      case 'bid': return 'bg-blue-200 border-b-2 border-blue-400';
      case 'response-toward': return 'bg-green-200 border-b-2 border-green-400';
      case 'response-away': return 'bg-yellow-200 border-b-2 border-yellow-400';
      case 'response-against': return 'bg-red-200 border-b-2 border-red-400';
      case 'opportunity': return 'bg-purple-200 border-b-2 border-purple-400';
      case 'concern': return 'bg-orange-200 border-b-2 border-orange-400';
      default: return 'bg-gray-200 border-b-2 border-gray-400';
    }
  };

  const getHighlightIcon = (type: string) => {
    switch (type) {
      case 'bid': return MessageCircle;
      case 'response-toward': return Heart;
      case 'response-away': return Info;
      case 'response-against': return AlertTriangle;
      case 'opportunity': return Target;
      case 'concern': return AlertTriangle;
      default: return Info;
    }
  };

  const handleMouseEnter = (highlightId: string, event: React.MouseEvent) => {
    setHoveredHighlight(highlightId);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setHoveredHighlight(null);
  };

  const handleCopySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion);
    toast.success('Suggestion copied to clipboard!');
    setHoveredHighlight(null);
  };

  const getSuggestionForHighlight = (highlight: Highlight) => {
    // If the highlight already has a suggestion, use it
    if (highlight.suggestion) {
      return highlight.suggestion;
    }
    
    // Return null if no built-in suggestion - we'll handle this in the tooltip
    return null;
  };

  const renderMessageWithHighlights = (message: Message) => {
    const messageHighlights = highlights.filter(h => h.messageId === message.id);
    
    if (messageHighlights.length === 0) {
      return <span>{message.text}</span>;
    }

    // Sort highlights by start index to process them in order
    const sortedHighlights = [...messageHighlights].sort((a, b) => a.startIndex - b.startIndex);
    
    const parts = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      // Ensure we don't have overlapping highlights
      const startIndex = Math.max(highlight.startIndex, lastIndex);
      const endIndex = Math.max(highlight.endIndex, startIndex + 1);
      
      // Add text before highlight
      if (startIndex > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {message.text.slice(lastIndex, startIndex)}
          </span>
        );
      }

      // Add highlighted text
      const highlightedText = message.text.slice(startIndex, endIndex);
      parts.push(
        <span
          key={highlight.id}
          className={`${getHighlightColor(highlight.type)} cursor-pointer rounded px-1 transition-all duration-200 hover:shadow-md`}
          onMouseEnter={(e) => handleMouseEnter(highlight.id, e)}
          onMouseLeave={handleMouseLeave}
        >
          {highlightedText}
        </span>
      );

      lastIndex = endIndex;
    });

    // Add remaining text
    if (lastIndex < message.text.length) {
      parts.push(
        <span key="text-end">
          {message.text.slice(lastIndex)}
        </span>
      );
    }

    return <>{parts}</>;
  };

  const hoveredHighlightData = hoveredHighlight 
    ? highlights.find(h => h.id === hoveredHighlight)
    : null;

  const speakerColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800'
  ];

  const getSpeakerColor = (speaker: string) => {
    const uniqueSpeakers = [...new Set(messages.map(m => m.speaker))];
    const speakerIndex = uniqueSpeakers.indexOf(speaker);
    return speakerColors[speakerIndex % speakerColors.length];
  };

  // If no highlights, show a simple message
  if (highlights.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <MessageCircle className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900">Conversation</h3>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSpeakerColor(message.speaker)}`}>
                {message.speaker}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-900 leading-relaxed">
                  {message.text}
                </div>
                {message.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 mt-4 text-center">No highlights detected in this conversation.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg relative">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900">Interactive Conversation Analysis</h3>
      </div>

      {/* Legend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Highlight Legend:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-4 h-2 bg-blue-200 border-b-2 border-blue-400 rounded"></span>
            <span>Bid for Connection</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-2 bg-green-200 border-b-2 border-green-400 rounded"></span>
            <span>Turning Toward</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-2 bg-yellow-200 border-b-2 border-yellow-400 rounded"></span>
            <span>Turning Away</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-2 bg-red-200 border-b-2 border-red-400 rounded"></span>
            <span>Turning Against</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-2 bg-purple-200 border-b-2 border-purple-400 rounded"></span>
            <span>Growth Opportunity</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-2 bg-orange-200 border-b-2 border-orange-400 rounded"></span>
            <span>Concern</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Hover over highlighted text to see suggestions</p>
      </div>

      {/* Conversation Messages */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSpeakerColor(message.speaker)}`}>
              {message.speaker}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900 leading-relaxed">
                {renderMessageWithHighlights(message)}
              </div>
              {message.timestamp && (
                <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredHighlightData && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm"
          style={{
            left: tooltipPosition.x - 150,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="flex items-center space-x-2 mb-2">
            {React.createElement(getHighlightIcon(hoveredHighlightData.type), {
              className: "w-4 h-4 text-blue-600"
            })}
            <span className="text-sm font-medium text-gray-900">
              {hoveredHighlightData.category}
            </span>
          </div>
          
          <p className="text-xs text-gray-600 mb-3">
            {hoveredHighlightData.explanation}
          </p>

          {(hoveredHighlightData.suggestion || getSuggestionForHighlight(hoveredHighlightData)) && (
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs font-medium text-gray-700 mb-2">
                {hoveredHighlightData.type === 'opportunity' || hoveredHighlightData.type === 'bid' ? 'Great job!' : 'Suggested improvement:'}
              </p>
              <div className="bg-blue-50 rounded p-2 mb-2">
                <p className="text-xs text-blue-800 italic">
                  "{hoveredHighlightData.suggestion || getSuggestionForHighlight(hoveredHighlightData)}"
                </p>
              </div>
              <button
                onClick={() => handleCopySuggestion(hoveredHighlightData.suggestion || getSuggestionForHighlight(hoveredHighlightData) || '')}
                className="flex items-center space-x-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
          )}
          
          {/* Show general suggestions if no specific one exists */}
          {!hoveredHighlightData.suggestion && !getSuggestionForHighlight(hoveredHighlightData) && suggestions.length > 0 && (
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs font-medium text-gray-700 mb-2">General suggestion:</p>
              <div className="bg-green-50 rounded p-2 mb-2">
                <p className="text-xs text-green-800 italic">
                  "{suggestions[0].text}"
                </p>
              </div>
              <button
                onClick={() => handleCopySuggestion(suggestions[0].text)}
                className="flex items-center space-x-1 text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveConversation;