import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Target, Heart, Brain, ArrowRight, Lightbulb, Eye, EyeOff, Wand2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const { setCurrentSnippet, setCurrentGoal } = useStore();
  const [snippet, setSnippet] = useState('');
  const [goal, setGoal] = useState('general');
  const [isRedacted, setIsRedacted] = useState(false);
  const [originalSnippet, setOriginalSnippet] = useState('');

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

  const handleAnalyze = () => {
    if (!snippet.trim()) {
      toast.error('Please enter a conversation snippet');
      return;
    }

    setCurrentSnippet(snippet);
    setCurrentGoal(goal);
    navigate('/analysis');
  };

  const selectedGoal = goals.find(g => g.id === goal);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="w-8 h-8 text-blue-600" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full absolute -top-1 -right-1 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  BetterFriend
                </h1>
                <p className="text-xs text-blue-600 font-medium -mt-1">AI Communication Coach</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="text-blue-600 text-sm">
                Based on proven relationship science
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Improve Your Communication
            </h2>
            <p className="text-xl text-blue-700 mb-2 font-medium">
              Get personalized suggestions based on proven relationship science frameworks
            </p>
            <p className="text-blue-600">
              Analyze conversations using Gottman Method and Nonviolent Communication principles
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-blue-100">
            <div className="mb-8">
              <label htmlFor="snippet" className="block text-sm font-medium text-gray-700 mb-2">
                Share your conversation
              </label>
              <textarea
                id="snippet"
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                placeholder="Paste your conversation here... For example:&#10;&#10;Me: How was your day?&#10;Partner: Fine.&#10;Me: Just fine? Did something happen?&#10;Partner: I don't want to talk about it.&#10;&#10;💡 Tip: Use 'Speaker: message' format for best results"
                className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 text-gray-800 leading-relaxed"
              />
              
              {/* Auto-redact button */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={autoRedact}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isRedacted 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                  }`}
                >
                  {isRedacted ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{isRedacted ? 'Show Real Names' : 'Auto-Redact Names'}</span>
                  <Wand2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                What's your goal?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {goals.map((goalOption) => {
                  const Icon = goalOption.icon;
                  return (
                    <button
                      key={goalOption.id}
                      onClick={() => setGoal(goalOption.id)}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg transform hover:-translate-y-1 ${
                        goal === goalOption.id
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700 bg-white hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-2" />
                      <div className="font-medium text-sm">{goalOption.label}</div>
                      <div className="text-xs opacity-75 mt-1">{goalOption.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!snippet.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Analyze Conversation</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Selected Goal Info */}
          {selectedGoal && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                <selectedGoal.icon className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  Goal: {selectedGoal.label}
                </h3>
              </div>
              <p className="text-blue-800">{selectedGoal.description}</p>
              
              {/* Goal-specific tips */}
              <div className="mt-4 p-4 bg-white bg-opacity-60 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Coaching Tip:</h4>
                <p className="text-sm text-blue-800">
                  {goal === 'reconnect' && "Focus on expressing care and creating emotional safety. Ask open-ended questions about their feelings."}
                  {goal === 'clarify' && "Use phrases like 'Help me understand' and reflect back what you heard to ensure clarity."}
                  {goal === 'apologize' && "Take specific responsibility without making excuses. Focus on the impact of your actions."}
                  {goal === 'boundary' && "Use 'I' statements to express your needs clearly while maintaining respect for the relationship."}
                  {goal === 'conflict' && "Stay curious about their perspective and look for shared values you both care about."}
                  {goal === 'general' && "Practice active listening and look for opportunities to show appreciation and understanding."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;