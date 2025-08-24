import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Heart, Shield, MessageSquare, TrendingUp, User, CheckCircle, XCircle, Clock, Target, Lightbulb, Copy, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ConflictPage = () => {
  const [selectedStyle, setSelectedStyle] = useState('warm');
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const communicationStyles = [
    { id: 'concise', label: 'Concise', description: 'Direct and to the point' },
    { id: 'warm', label: 'Warm', description: 'Empathetic and caring' },
    { id: 'professional', label: 'Professional', description: 'Formal and structured' }
  ];

  const deEscalationSteps = [
    {
      title: 'Pause & Breathe',
      description: 'Take a moment to center yourself before responding',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Acknowledge Their Feelings',
      description: 'Show that you hear and understand their perspective',
      icon: Heart,
      color: 'green'
    },
    {
      title: 'Take Responsibility',
      description: 'Own your part without making excuses',
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Find Common Ground',
      description: 'Identify what you both care about',
      icon: CheckCircle,
      color: 'indigo'
    }
  ];

  const repairScripts = {
    concise: [
      "I was wrong. Let me fix this.",
      "I hear you're upset. What do you need?",
      "Can we start over? I care about us."
    ],
    warm: [
      "I realize I hurt you, and I'm truly sorry. That wasn't my intention, but I understand the impact.",
      "I can see this is really important to you. Help me understand what you're feeling right now.",
      "I love you and I want to make this right. What would help you feel heard?"
    ],
    professional: [
      "I acknowledge that my approach was ineffective and I take responsibility for the miscommunication.",
      "I value our relationship and would like to understand your perspective more clearly.",
      "I propose we take a step back and address this systematically to find a mutually beneficial solution."
    ]
  };

  const dosDonts = [
    {
      category: 'Do',
      items: [
        'Use "I" statements to express your feelings',
        'Listen actively without planning your rebuttal',
        'Acknowledge their perspective before sharing yours',
        'Focus on the specific behavior, not their character',
        'Suggest a break if emotions are too high'
      ]
    },
    {
      category: "Don't",
      items: [
        'Use absolute words like "always" or "never"',
        'Bring up past unrelated conflicts',
        'Make assumptions about their intentions',
        'Respond immediately when you\'re angry',
        'Try to "win" the argument'
      ]
    }
  ];

  const handleCopyScript = (script: string) => {
    navigator.clipboard.writeText(script);
    setCopiedScript(script);
    setTimeout(() => setCopiedScript(null), 2000);
    toast.success('Script copied to clipboard!');
  };

  const getStepColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
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
              <Link className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 bg-blue-100 text-blue-700" to="/conflict">
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
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-blue-600" to="/analysis">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-medium mt-1">Analysis</span>
              </Link>
              <Link className="flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 bg-blue-100 text-blue-700" to="/conflict">
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
                  <h1 className="text-2xl font-bold text-gray-900">Conflict Resolution</h1>
                  <p className="text-blue-700">De-escalate and repair with proven frameworks</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Side - De-escalation Steps */}
              <div className="lg:col-span-2 space-y-6">
                {/* Communication Style Selector */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Communication Style</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {communicationStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedStyle === style.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900">{style.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* De-escalation Steps */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-6">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">De-escalation Steps</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {deEscalationSteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                            currentStep === index
                              ? `${getStepColor(step.color)} border-opacity-100`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setCurrentStep(index)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${getStepColor(step.color)}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">{step.title}</h4>
                              <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                            <div className="text-sm font-medium text-gray-400">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Repair Scripts */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-6">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Repair Scripts</h3>
                    <span className="text-sm text-gray-500">({selectedStyle} style)</span>
                  </div>
                  
                  <div className="space-y-3">
                    {repairScripts[selectedStyle as keyof typeof repairScripts].map((script, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm text-blue-900 font-medium flex-1 pr-4">"{script}"</p>
                          <button
                            onClick={() => handleCopyScript(script)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                              copiedScript === script
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {copiedScript === script ? (
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Do's and Don'ts */}
              <div className="lg:col-span-1 space-y-6">
                {dosDonts.map((section) => (
                  <div key={section.category} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-2 mb-4">
                      {section.category === 'Do' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900">{section.category}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {section.items.map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg text-sm ${
                            section.category === 'Do'
                              ? 'bg-green-50 text-green-800 border border-green-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-white text-purple-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors border border-purple-200">
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Generate New Scripts
                    </button>
                    <Link
                      to="/"
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors block text-center"
                    >
                      Analyze New Conversation
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

export default ConflictPage;