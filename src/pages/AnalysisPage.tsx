import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Lightbulb, Heart, MessageSquare, Target, TrendingUp, Brain, AlertCircle, CheckCircle, Star, AlertTriangle, User, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import InteractiveConversation from '../components/InteractiveConversation';
import ConversationHighlights from '../components/ConversationHighlights';
import toast from 'react-hot-toast';
import { analyzeConversation } from '../utils/analysisUtils';

const AnalysisPage = () => {
  const { currentSnippet, currentGoal } = useStore();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [interactiveHighlights, setInteractiveHighlights] = useState([]);
  const [parsedMessages, setParsedMessages] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [copiedSuggestions, setCopiedSuggestions] = useState(new Set());

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

  const handleCopySuggestion = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSuggestions(prev => new Set([...prev, id]));
    setTimeout(() => {
      setCopiedSuggestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 2000);
    toast.success('Copied to clipboard!');
  };

  if (!currentSnippet) {
    return (
      <div className="min-h-screen pt-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-blue-400 mx-auto mb-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <a className="flex items-center space-x-2" href="/" data-discover="true">
              <div className="relative w-8 h-8">
                <svg viewBox="0 0 32 32" className="w-8 h-8">
                  <path d="M6 8c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v6c0 2.2-1.8 4-4 4h-2l-3 3-3-3h-2c-2.2 0-4-1.8-4-4V8z" fill="#3B82F6" opacity="0.7"></path>
                  <path d="M10 12c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v6c0 2.2-1.8 4-4 4h-2l-3 3-3-3h-2c-2.2 0-4-1.8-4-4v-6z" fill="#8B5CF6"></path>
                  <circle cx="16" cy="15" r="1.5" fill="white" opacity="0.9"></circle>
                  <circle cx="20" cy="15" r="1.5" fill="white" opacity="0.9"></circle>
                  <circle cx="12" cy="11" r="1.5" fill="white" opacity="0.6"></circle>
                  <path d="M18 10.5c0-1.1.9-2 2-2s2 .9 2 2c0 .6-.3 1.1-.7 1.4L20 13.2l-1.3-1.3c-.4-.3-.7-.8-.7-1.4z" fill="#EF4444" opacity="0.8"></path>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">BetterFriend</span>
            </a>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50" to="/">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Coach</span>
              </Link>
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 bg-blue-100 text-blue-700" to="/analysis">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Analysis</span>
              </Link>
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50" to="/conflict">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Conflict</span>
              </Link>
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50" to="/progress">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Progress</span>
              </Link>
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50" to="/profile">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
            </nav>

            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-500 font-medium">Privacy Protected</span>
            </div>
          </div>
          <div className="md:hidden flex justify-center pb-3">
            <nav className="flex items-center space-x-1 bg-white rounded-full p-1 shadow-sm">
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-blue-600" to="/">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-medium mt-1">Coach</span>
              </Link>
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 bg-blue-100 text-blue-700" to="/analysis">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-medium mt-1">Analysis</span>
              </Link>
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-blue-600" to="/conflict">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium mt-1">Conflict</span>
              </Link>
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-blue-600" to="/progress">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium mt-1">Progress</span>
              </Link>
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-blue-600" to="/profile">
                <User className="w-4 h-4" />
                <span className="text-xs font-medium mt-1">Profile</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Conversation Analysis</h1>
                  <p className="text-blue-700">Goal: <span className="font-semibold text-indigo-600 capitalize">{currentGoal}</span></p>
                </div>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing your conversation...</h3>
                  <p className="text-blue-600">Applying communication frameworks and generating personalized suggestions</p>
                </div>
              </div>
            ) : (
              analysis && (
                <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Side - Conversation with Embedded Analysis */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Suggestions Section - Now prominently displayed */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 shadow-xl border-2 border-green-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Lightbulb className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-900">Personalized Suggestions</h3>
                        <p className="text-green-700 text-sm">Based on your goal: <span className="font-semibold capitalize">{currentGoal}</span></p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={suggestion.id}
                          className={`p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                            selectedSuggestion === suggestion.id
                              ? 'border-green-400 bg-white shadow-lg transform scale-[1.02]'
                              : 'border-green-200 bg-white hover:border-green-300 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedSuggestion(selectedSuggestion === suggestion.id ? null : suggestion.id)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                {suggestion.style}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopySuggestion(suggestion.text, suggestion.id);
                              }}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                copiedSuggestions.has(suggestion.id)
                                  ? 'bg-green-500 text-white'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {copiedSuggestions.has(suggestion.id) ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-gray-800 font-medium mb-2 leading-relaxed">"{suggestion.text}"</p>
                          <p className="text-xs text-gray-600 mb-2">{suggestion.rationale}</p>
                          <p className="text-xs text-green-600 font-medium">{suggestion.framework}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Interactive Conversation */}
                  <InteractiveConversation 
                    messages={parsedMessages}
                    highlights={interactiveHighlights}
                    suggestions={suggestions}
                  />
                  
                  {/* Embedded Patterns Detected */}
                  <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <Target className="w-5 h-5 text-indigo-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Patterns Detected</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {analysis.patterns && analysis.patterns.length > 0 ? analysis.patterns.map((pattern: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
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
                  <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200">
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
                  <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Communication Framework</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
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

                      <div className="border-2 border-green-200 rounded-xl p-4 bg-gradient-to-r from-green-50 to-emerald-50">
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
                        <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg border border-green-300">
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
                    <div className="bg-white rounded-xl p-6 shadow-xl border-l-4 border-orange-500">
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
        </div>
      </main>
    </div>
  );
};

export default AnalysisPage;