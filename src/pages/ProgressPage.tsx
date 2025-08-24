import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Heart, Shield, MessageSquare, AlertTriangle, User, Calendar, Target, Award, BookOpen, Zap, Plus, Edit3, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProgressPage = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Mock data for demonstration
  const streakData = [
    { name: 'Positive Responses', current: 7, best: 12, color: 'green' },
    { name: 'Active Listening', current: 5, best: 8, color: 'blue' },
    { name: 'Gratitude Expressions', current: 3, best: 5, color: 'purple' },
    { name: 'Conflict Resolution', current: 2, best: 4, color: 'orange' }
  ];

  const bidsData = {
    made: 23,
    responded: 18,
    responseRate: 78
  };

  const recentActivities = [
    { date: '2024-01-15', action: 'Used repair script', context: 'Conversation with Alex', impact: 'positive' },
    { date: '2024-01-14', action: 'Expressed gratitude', context: 'Text to roommate', impact: 'positive' },
    { date: '2024-01-13', action: 'Active listening', context: 'Call with friend', impact: 'positive' },
    { date: '2024-01-12', action: 'Set boundary', context: 'Work conversation', impact: 'neutral' }
  ];

  const friendshipVitamins = [
    { name: 'Weekly Check-in', frequency: 'Weekly', lastSent: '2 days ago', status: 'active' },
    { name: 'Gratitude Note', frequency: 'Bi-weekly', lastSent: '1 week ago', status: 'due' },
    { name: 'Memory Share', frequency: 'Monthly', lastSent: '3 weeks ago', status: 'upcoming' }
  ];

  const getStreakColor = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getActivityColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-green-50 border-green-200 text-green-800';
      case 'neutral': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'negative': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getVitaminStatus = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'due': return 'bg-orange-100 text-orange-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveJournal = () => {
    setIsEditing(false);
    // Here you would save to your backend
  };

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
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50" to="/analysis">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Analysis</span>
              </Link>
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50" to="/conflict">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Conflict</span>
              </Link>
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 bg-blue-100 text-blue-700" to="/progress">
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
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-blue-600" to="/analysis">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-medium mt-1">Analysis</span>
              </Link>
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-blue-600" to="/conflict">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium mt-1">Conflict</span>
              </Link>
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 bg-blue-100 text-blue-700" to="/progress">
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
                  <h1 className="text-2xl font-bold text-gray-900">Progress & Reflection</h1>
                  <p className="text-blue-700">Track your communication growth and build positive habits</p>
                </div>
              </div>
              
              {/* Timeframe Selector */}
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                {['week', 'month', 'year'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                      selectedTimeframe === timeframe
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Side - Streaks and Bids */}
              <div className="lg:col-span-2 space-y-6">
                {/* Communication Streaks */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-6">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Communication Streaks</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {streakData.map((streak, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${getStreakColor(streak.color)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{streak.name}</h4>
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold">{streak.current}</span>
                          <span className="text-sm opacity-75">days</span>
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          Best: {streak.best} days
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bids Counter */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-6">
                    <Target className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Connection Bids</h3>
                    <span className="text-sm text-gray-500">This {selectedTimeframe}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{bidsData.made}</div>
                      <div className="text-sm text-gray-600">Bids Made</div>
                      <div className="text-xs text-gray-500 mt-1">Attempts to connect</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">{bidsData.responded}</div>
                      <div className="text-sm text-gray-600">Responded To</div>
                      <div className="text-xs text-gray-500 mt-1">Positive responses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">{bidsData.responseRate}%</div>
                      <div className="text-sm text-gray-600">Response Rate</div>
                      <div className="text-xs text-gray-500 mt-1">Success ratio</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Great progress!</strong> You're responding to {bidsData.responseRate}% of connection attempts. 
                      Research shows that couples who respond positively to bids 86% of the time stay together.
                    </p>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-6">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${getActivityColor(activity.impact)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{activity.action}</div>
                            <div className="text-xs opacity-75 mt-1">{activity.context}</div>
                          </div>
                          <div className="text-xs opacity-75">{activity.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Journal and Vitamins */}
              <div className="lg:col-span-1 space-y-6">
                {/* Friendship Vitamins */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Friendship Vitamins</h3>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {friendshipVitamins.map((vitamin, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{vitamin.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVitaminStatus(vitamin.status)}`}>
                            {vitamin.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div>{vitamin.frequency}</div>
                          <div className="mt-1">Last sent: {vitamin.lastSent}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reflection Journal */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Reflection Journal</h3>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={handleSaveJournal}
                          className="p-1 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <textarea
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      placeholder="Reflect on your recent conversations... What went well? What could you improve?"
                      className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  ) : (
                    <div className="min-h-32 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {journalEntry ? (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{journalEntry}</p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Click the edit button to start reflecting on your communication journey...
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 shadow-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link
                      to="/"
                      className="w-full bg-white text-green-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors border border-green-200 block text-center"
                    >
                      Analyze New Conversation
                    </Link>
                    <Link
                      to="/conflict"
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors block text-center"
                    >
                      Practice Conflict Resolution
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;