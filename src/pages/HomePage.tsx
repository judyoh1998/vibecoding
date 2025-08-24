import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Target, Heart, Brain, ArrowRight, Lightbulb } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const { setCurrentSnippet, setCurrentGoal } = useStore();
  const [snippet, setSnippet] = useState('');
  const [goal, setGoal] = useState('general');

  const goals = [
    { id: 'reconnect', label: 'Reconnect', icon: Heart, description: 'Rebuild connection and intimacy' },
    { id: 'clarify', label: 'Clarify', icon: MessageSquare, description: 'Clear up misunderstandings' },
    { id: 'apologize', label: 'Apologize', icon: Target, description: 'Make a meaningful apology' },
    { id: 'boundary', label: 'Set Boundary', icon: Brain, description: 'Communicate needs respectfully' },
    { id: 'conflict', label: 'Resolve Conflict', icon: Lightbulb, description: 'Navigate disagreements' },
    { id: 'general', label: 'General', icon: MessageSquare, description: 'Improve overall communication' }
  ];

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
    <div className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">BetterFriend</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Your AI Communication Coach</p>
          <p className="text-gray-500">
            Get personalized suggestions based on proven relationship science
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <label htmlFor="snippet" className="block text-sm font-medium text-gray-700 mb-2">
              Share your conversation
            </label>
            <textarea
              id="snippet"
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              placeholder="Paste your conversation here... For example:&#10;&#10;Me: How was your day?&#10;Partner: Fine.&#10;Me: Just fine? Did something happen?&#10;Partner: I don't want to talk about it."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              What's your goal?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {goals.map((goalOption) => {
                const Icon = goalOption.icon;
                return (
                  <button
                    key={goalOption.id}
                    onClick={() => setGoal(goalOption.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      goal === goalOption.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
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
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>Analyze Conversation</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Goal Info */}
        {selectedGoal && (
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <selectedGoal.icon className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">
                Goal: {selectedGoal.label}
              </h3>
            </div>
            <p className="text-blue-800">{selectedGoal.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;