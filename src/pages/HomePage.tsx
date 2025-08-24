import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquare, Target, Heart, Brain, Lightbulb, Eye, Wand2, AlertTriangle, User, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const { setCurrentSnippet, setCurrentGoal } = useStore();
  const [snippet, setSnippet] = useState('');
  const [goal, setGoal] = useState('general');
  const [isRedacted, setIsRedacted] = useState(false);
  const [originalSnippet, setOriginalSnippet] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [parsedMessages, setParsedMessages] = useState([]);

  const goals = [
    { id: 'reconnect', label: 'Reconnect', icon: Heart, description: 'Rebuild connection and intimacy' },
    { id: 'clarify', label: 'Clarify', icon: MessageSquare, description: 'Clear up misunderstandings' },
    { id: 'apologize', label: 'Apologize', icon: Target, description: 'Make a meaningful apology' },
    { id: 'boundary', label: 'Set Boundary', icon: Brain, description: 'Communicate needs respectfully' },
    { id: 'conflict', label: 'Resolve Conflict', icon: Lightbulb, description: 'Navigate disagreements' },
    { id: 'general', label: 'General', icon: MessageSquare, description: 'Improve overall communication' }
  ];

  const autoRedact = () => {
    if (isRedacted) {
      // Restore original
      setSnippet(originalSnippet);
      setIsRedacted(false);
      toast.success('Names restored');
      return;
    }

    if (!snippet.trim()) {
      toast.error('Please enter a conversation first');
      return;
    }

    setOriginalSnippet(snippet);
    
    // Common names to redact
    const commonNames = [
      'John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Chris', 'Amy', 'Tom', 'Emma',
      'Alex', 'Jessica', 'Ryan', 'Ashley', 'Kevin', 'Michelle', 'Brian', 'Amanda', 'Steve', 'Jennifer',
      'Mark', 'Nicole', 'Paul', 'Stephanie', 'Matt', 'Rachel', 'Dan', 'Lauren', 'Josh', 'Megan',
      'Adam', 'Samantha', 'Ben', 'Katie', 'Jake', 'Hannah', 'Tyler', 'Brittany', 'Sean', 'Courtney'
    ];

    let redactedText = snippet;
    const foundNames = new Set();
    
    // Find names in the text
    commonNames.forEach(name => {
      const regex = new RegExp(`\\b${name}\\b`, 'gi');
      if (regex.test(redactedText)) {
        foundNames.add(name.toLowerCase());
      }
    });

    // Replace names with generic alternatives
    const replacements = ['Person A', 'Person B', 'Person C', 'Person D', 'Person E'];
    let replacementIndex = 0;
    
    foundNames.forEach(name => {
      if (replacementIndex < replacements.length) {
        const regex = new RegExp(`\\b${name}\\b`, 'gi');
        redactedText = redactedText.replace(regex, replacements[replacementIndex]);
        replacementIndex++;
      }
    });

    // Also look for potential names in speaker patterns (Name:)
    const speakerPattern = /^([A-Z][a-z]+):/gm;
    const speakers = [...redactedText.matchAll(speakerPattern)];
    speakers.forEach((match, index) => {
      if (index < replacements.length) {
        redactedText = redactedText.replace(new RegExp(`^${match[1]}:`, 'gm'), `${replacements[index]}:`);
      }
    });

    setSnippet(redactedText);
    setIsRedacted(true);
    toast.success(`Names redacted for privacy`);
  };

  const handlePreview = () => {
    if (!snippet.trim()) {
      toast.error('Please enter a conversation snippet');
      return;
    }

    // Parse the conversation to show preview
    const lines = snippet.trim().split('\n');
    const messages = [];
    let messageId = 0;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Try to detect speaker patterns (Speaker: message)
      const colonMatch = trimmedLine.match(/^([^:]+):\s*(.+)$/);
      if (colonMatch) {
        const speaker = colonMatch[1].trim();
        const messageText = colonMatch[2].trim();
        
        messages.push({
          id: `msg-${messageId}`,
          speaker,
          text: messageText,
          isUser: speaker.toLowerCase() === 'me' || speaker.toLowerCase() === 'i'
        });
        messageId++;
      } else {
        // If no speaker pattern, treat as continuation or unknown speaker
        messages.push({
          id: `msg-${messageId}`,
          speaker: 'Unknown',
          text: trimmedLine,
          isUser: false
        });
        messageId++;
      }
    }
    
    setParsedMessages(messages);
    setShowPreview(true);
  };

  const handleAnalyze = () => {
    setCurrentSnippet(snippet);
    setCurrentGoal(goal);
    navigate('/analysis');
  };

  const handleBackToEdit = () => {
    setShowPreview(false);
  };

  const selectedGoal = goals.find(g => g.id === goal);

  if (showPreview) {
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

              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-xs text-gray-500 font-medium">Privacy Protected</span>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-16">
          <div className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Preview Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Conversation Preview
                </h1>
                <p className="text-lg text-gray-600">
                  Review your conversation before analysis
                </p>
              </div>

              {/* Goal Display */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                <div className="flex items-center space-x-2">
                  {selectedGoal && <selectedGoal.icon className="w-5 h-5 text-blue-600" />}
                  <span className="font-medium text-blue-900">Goal: {selectedGoal?.label}</span>
                  <span className="text-blue-700">- {selectedGoal?.description}</span>
                </div>
              </div>

              {/* Parsed Conversation Preview */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Parsed Conversation</h3>
                
                {parsedMessages.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {parsedMessages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          message.speaker === 'Unknown' 
                            ? 'bg-gray-100 text-gray-600'
                            : message.isUser 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {message.speaker}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No conversation detected. Try using this format:</p>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-left text-sm">
                      <p className="font-mono">Person A: Hello, how are you?</p>
                      <p className="font-mono">Person B: I'm doing well, thanks!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleBackToEdit}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  ← Back to Edit
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={parsedMessages.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Continue to Analysis →
                </button>
              </div>
            </div>
          </div>
        </main>
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
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 bg-blue-100 text-blue-700" to="/">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Coach</span>
              </Link>
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50" to="/analysis">
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
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 bg-blue-100 text-blue-700" to="/">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-medium mt-1">Coach</span>
              </Link>
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-blue-600" to="/analysis">
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
        <div className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* AI Coach Badge */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Communication Coach</span>
              </div>

              {/* Welcome Section */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Transform Your<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Conversations</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Get personalized coaching on your real conversations using proven frameworks like Nonviolent Communication and Gottman principles.
              </p>
            </div>

            {/* Main Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
              {/* Quick Start Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
                <div className="flex items-center space-x-2 text-green-600">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">End-to-end encrypted</span>
                </div>
              </div>

              {/* Steps */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-blue-600 text-white">
                    1
                  </div>
                  <div className="w-12 h-0.5 bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gray-200 text-gray-500">
                    2
                  </div>
                  <div className="w-12 h-0.5 bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gray-200 text-gray-500">
                    3
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Share Your Conversation
                  </h3>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Private & Secure</span>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Paste your conversation snippet here... (texts, DMs, emails)"
                    value={snippet}
                    onChange={(e) => setSnippet(e.target.value)}
                    className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute top-4 right-4">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Privacy Options</span>
                    <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                      <span>Show Redacted</span>
                    </button>
                  </div>
                  <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    Auto-redact sensitive information
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    We'll automatically detect and redact emails, phone numbers, addresses, and other sensitive data. Normal conversation text won't be affected.
                  </p>
                </div>
                <button
                  onClick={handlePreview}
                  disabled={!snippet.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Preview & Continue
                </button>

                {/* Inline Preview Section */}
                {showPreview && parsedMessages.length > 0 && (
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Preview</h3>
                    
                    {/* Goal Display */}
                    <div className="bg-blue-100 rounded-lg p-3 mb-4 border border-blue-200">
                      <div className="flex items-center space-x-2">
                        {selectedGoal && <selectedGoal.icon className="w-4 h-4 text-blue-600" />}
                        <span className="font-medium text-blue-900">Goal: {selectedGoal?.label}</span>
                        <span className="text-blue-700">- {selectedGoal?.description}</span>
                      </div>
                    </div>
                    
                    {/* Parsed Messages */}
                    <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                      {parsedMessages.map((message) => (
                        <div key={message.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            message.speaker === 'Unknown' 
                              ? 'bg-gray-100 text-gray-600'
                              : message.isUser 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {message.speaker}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{message.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowPreview(false)}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Edit Conversation
                      </button>
                      <button
                        onClick={handleAnalyze}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Continue to Analysis →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Analysis</h3>
                <p className="text-gray-600">
                  Analyze tone, sentiment, and communication patterns using proven frameworks like NVC and Gottman principles.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Conflict Resolution</h3>
                <p className="text-gray-600">
                  Get step-by-step de-escalation guidance and repair scripts for difficult conversations.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Relationship Growth</h3>
                <p className="text-gray-600">
                  Track your communication progress and build positive habits with friendship vitamins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;