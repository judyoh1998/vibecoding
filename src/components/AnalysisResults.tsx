import React from 'react';
import { TrendingUp, Heart, Brain, AlertCircle } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: {
    sentiment: { score: number; label: string };
    tone: string[];
    frameworks: {
      nvc: {
        observation: string;
        feeling: string;
        need: string;
        request: string;
      };
      gottman: {
        bids: number;
        turning_toward: number;
        turning_away: number;
        turning_against: number;
        criticism: number;
        defensiveness: number;
        stonewalling: number;
        repair_attempts: number;
      };
    };
    patterns: string[];
    risks: string[];
  };
}

const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'bg-green-100 text-green-800';
    if (score < -0.3) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Emotional Tone */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Heart className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-900">Emotional Tone</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Overall Sentiment</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysis.sentiment.score)}`}>
              {analysis.sentiment.label}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {analysis.tone.map((tone, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {tone}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Communication Framework */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Communication Framework</h3>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Nonviolent Communication (NVC)</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-blue-700">Observation:</span>
                <p className="text-gray-600">{analysis.frameworks.nvc.observation}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Feeling:</span>
                <p className="text-gray-600">{analysis.frameworks.nvc.feeling}</p>
              </div>
              <div>
                <span className="font-medium text-purple-700">Need:</span>
                <p className="text-gray-600">{analysis.frameworks.nvc.need}</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Gottman Method</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analysis.frameworks.gottman.bids}</div>
                <div className="text-gray-600">Bids Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analysis.frameworks.gottman.turning_toward}</div>
                <div className="text-gray-600">Turning Toward</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patterns */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900">Patterns Detected</h3>
        </div>
        
        <div className="space-y-2">
          {analysis.patterns.length > 0 ? analysis.patterns.map((pattern, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">{pattern}</span>
            </div>
          )) : (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No specific patterns detected.</p>
            </div>
          )}
        </div>
      </div>

      {/* Risk Assessment */}
      {analysis.risks.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Gentle Reminders</h3>
          </div>
          
          <div className="space-y-2">
            {analysis.risks.map((risk, index) => (
              <p key={index} className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
                {risk}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;