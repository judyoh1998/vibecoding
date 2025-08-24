import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, ThumbsUp, ThumbsDown, Lightbulb, Heart, MessageSquare, Target, TrendingUp, Brain, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import InteractiveConversation from '../components/InteractiveConversation';
import ConversationHighlights from '../components/ConversationHighlights';
import toast, { Toaster } from 'react-hot-toast';
import { analyzeConversation } from '../utils/analysisUtils';

const AnalysisPage = () => {
  const { currentSnippet, currentGoal } = useStore();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [interactiveHighlights, setInteractiveHighlights] = useState([]);
  const [parsedMessages, setParsedMessages] = useState([]);

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'bg-green-100 text-green-800';
    if (score < -0.3) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    const performAnalysis = async () => {
      setIsAnalyzing(true);
      
      try {
        const result = await analyzeConversation(currentSnippet, currentGoal);
        
        setAnalysis(result.analysis);
        setSuggestions(result.suggestions);
        setHighlights(result.highlights);
        setInteractiveHighlights(result.interactiveHighlights);
        setParsedMessages(result.parsedMessages);
      } catch (error) {
        console.error('Analysis failed:', error);
        // Handle error state if needed
      }
      
      setIsAnalyzing(false);
    };

    performAnalysis();
  }, []);

  const handleCopySuggestion = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!currentSnippet) {
    return (
      <div className="min-h-screen pt-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No conversation to analyze</h2>
          <p className="text-gray-600 mb-6">Start by sharing a conversation snippet on the home page.</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conversation Analysis</h1>
              <p className="text-gray-600">Goal: <span className="font-medium text-blue-600 capitalize">{currentGoal}</span></p>
            </div>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing your conversation...</h3>
              <p className="text-gray-600">Applying communication frameworks and generating suggestions</p>
            </div>
          </div>
        ) : (
          analysis && (
            <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Conversation with Embedded Analysis */}
            <div className="lg:col-span-2 space-y-6">
              {/* Interactive Conversation */}
              <InteractiveConversation 
                messages={parsedMessages}
                highlights={interactiveHighlights}
                suggestions={suggestions}
              />
              
              {/* Embedded Patterns Detected */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Patterns Detected</h3>
                </div>
                
                <div className="space-y-2">
                  {analysis.patterns && analysis.patterns.length > 0 ? analysis.patterns.map((pattern: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-indigo-800">{pattern}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No specific patterns detected. Check the interactive conversation above for highlights.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Analysis Components */}
            <div className="lg:col-span-1 space-y-6">
              {/* Emotional Tone */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Emotional Tone</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700">Overall Sentiment</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysis.sentiment.score)}`}>
                      {analysis.sentiment.label}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {analysis.tone.map((tone: string, index: number) => (
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

              {/* Key Conversation Moments */}
              <ConversationHighlights 
                highlights={highlights}
                originalMessages={parsedMessages}
              />

              {/* Communication Framework with Examples */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Communication Framework</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Nonviolent Communication (NVC)</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-blue-700">Observation:</span>
                        <p className="text-gray-600 mt-1">{analysis.frameworks.nvc.observation}</p>
                        <p className="text-xs text-blue-600 italic mt-1">Example: "When I heard you say..."</p>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Feeling:</span>
                        <p className="text-gray-600 mt-1">{analysis.frameworks.nvc.feeling}</p>
                        <p className="text-xs text-green-600 italic mt-1">Example: "I feel concerned because..."</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700">Need:</span>
                        <p className="text-gray-600 mt-1">{analysis.frameworks.nvc.need}</p>
                        <p className="text-xs text-purple-600 italic mt-1">Example: "I need to feel heard and understood"</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Gottman Method</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{analysis.frameworks.gottman.bids}</div>
                        <div className="text-gray-600">Bids Made</div>
                        <p className="text-xs text-gray-500 mt-1">Attempts to connect</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analysis.frameworks.gottman.turning_toward}</div>
                        <div className="text-gray-600">Turning Toward</div>
                        <p className="text-xs text-gray-500 mt-1">Positive responses</p>
                      </div>
                    </div>
                    
                    {/* Gottman Examples */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="font-medium text-blue-900 mb-2">💡 Examples</h5>
                      <div className="space-y-1 text-xs text-blue-800">
                        <p><strong>Bid:</strong> "How was your day?"</p>
                        <p><strong>Turn Toward:</strong> "It was good! Let me tell you about..."</p>
                        <p><strong>Turn Away:</strong> "Fine." (while looking at phone)</p>
                      </div>
                    </div>
                  </div>
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
                    {analysis.risks.map((risk: string, index: number) => (
                      <p key={index} className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
                        {risk}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          )
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default AnalysisPage;