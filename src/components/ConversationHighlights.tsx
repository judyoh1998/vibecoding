import React from 'react';
import { Star, MessageCircle, Heart, Target } from 'lucide-react';

interface Highlight {
  id: string;
  text: string;
  speaker: string;
  type: 'positive' | 'opportunity' | 'concern';
  category: string;
  explanation: string;
}

interface Message {
  id: string;
  speaker: string;
  text: string;
  isUser?: boolean;
}

interface ConversationHighlightsProps {
  highlights: Highlight[];
  originalMessages: Message[];
}

const ConversationHighlights = ({ highlights, originalMessages }: ConversationHighlightsProps) => {
  const getHighlightIcon = (type: string) => {
    switch (type) {
      case 'positive': return Heart;
      case 'opportunity': return Target;
      case 'concern': return MessageCircle;
      default: return Star;
    }
  };

  const getHighlightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-200 text-green-800';
      case 'opportunity': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'concern': return 'bg-orange-50 border-orange-200 text-orange-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (highlights.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Key Moments</h3>
        </div>
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">No key moments detected in this conversation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Key Moments</h3>
      </div>
      
      <div className="space-y-3">
        {highlights.map((highlight) => {
          const Icon = getHighlightIcon(highlight.type);
          return (
            <div
              key={highlight.id}
              className={`p-4 rounded-lg border ${getHighlightColor(highlight.type)}`}
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium">{highlight.category}</span>
                    <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded-full">
                      {highlight.speaker}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-2">"{highlight.text}"</p>
                  <p className="text-xs opacity-75">{highlight.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationHighlights;