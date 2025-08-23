import { parseConversation, generateHighlights, generateInteractiveHighlights } from './conversationParser';

export interface AnalysisResult {
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
  suggestions: any[];
  highlights: any[];
  interactiveHighlights: any[];
  parsedMessages: any[];
}

export const analyzeConversation = async (
  currentSnippet: string, 
  currentGoal: string
): Promise<AnalysisResult> => {
  // Simulate processing time for better UX
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Parse the conversation
  const parsed = parseConversation(currentSnippet);
  const parsedMessages = parsed.messages;
  
  // Generate analysis using rule-based approach
  const analysis = generateAnalysis(currentSnippet, parsedMessages, currentGoal);
  
  // Generate highlights
  const highlights = generateHighlights(parsedMessages, analysis);
  const interactiveHighlights = generateInteractiveHighlights(parsedMessages, analysis);
  
  // Generate suggestions
  const suggestions = generateSuggestions(currentGoal, highlights, analysis);

  return {
    analysis,
    suggestions,
    highlights,
    interactiveHighlights,
    parsedMessages
  };
};

const generateAnalysis = (text: string, messages: any[], goal: string) => {
  const textLower = text.toLowerCase();
  
  // Sentiment analysis using rule-based approach
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 
    'happy', 'pleased', 'excited', 'grateful', 'thankful', 'appreciate', 'awesome',
    'perfect', 'brilliant', 'outstanding', 'superb', 'delighted', 'thrilled'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 
    'sad', 'upset', 'annoyed', 'irritated', 'furious', 'devastated', 'horrible',
    'disgusting', 'pathetic', 'stupid', 'ridiculous', 'worthless', 'useless'
  ];
  
  const neutralWords = [
    'okay', 'fine', 'alright', 'sure', 'maybe', 'perhaps', 'possibly', 'probably'
  ];

  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) positiveCount += matches.length;
  });

  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) negativeCount += matches.length;
  });

  neutralWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) neutralCount += matches.length;
  });

  // Calculate sentiment
  let sentimentScore = 0;
  let sentimentLabel = 'Neutral';

  if (positiveCount > negativeCount + neutralCount) {
    sentimentScore = 0.6;
    sentimentLabel = 'Positive';
  } else if (negativeCount > positiveCount + neutralCount) {
    sentimentScore = -0.6;
    sentimentLabel = 'Negative';
  } else if (positiveCount > negativeCount) {
    sentimentScore = 0.3;
    sentimentLabel = 'Slightly Positive';
  } else if (negativeCount > positiveCount) {
    sentimentScore = -0.3;
    sentimentLabel = 'Slightly Negative';
  }

  // Tone analysis
  const tone = [];
  if (positiveCount > 2) tone.push('Positive');
  if (negativeCount > 2) tone.push('Frustrated');
  if (text.includes('?')) tone.push('Curious');
  if (textLower.includes('sorry') || textLower.includes('apologize')) tone.push('Apologetic');
  if (textLower.includes('thank') || textLower.includes('appreciate')) tone.push('Grateful');
  if (tone.length === 0) tone.push('Conversational');

  // Gottman analysis
  const gottmanAnalysis = analyzeGottmanPatterns(text, messages);
  
  // NVC analysis
  const nvcAnalysis = analyzeNVCPatterns(text, messages);

  // Pattern detection
  const patterns = detectCommunicationPatterns(text, messages);

  // Risk assessment
  const risks = assessCommunicationRisks(text, messages);

  return {
    sentiment: {
      score: sentimentScore,
      label: sentimentLabel
    },
    tone,
    frameworks: {
      nvc: nvcAnalysis,
      gottman: gottmanAnalysis
    },
    patterns,
    risks
  };
};

const analyzeGottmanPatterns = (text: string, messages: any[]) => {
  const textLower = text.toLowerCase();
  
  // Count bids for connection (questions, sharing, invitations)
  let bids = 0;
  if (text.includes('?')) bids += (text.match(/\?/g) || []).length;
  if (textLower.includes('want to') || textLower.includes('let\'s')) bids++;
  if (textLower.includes('how are') || textLower.includes('how was')) bids++;

  // Count responses
  let turning_toward = 0;
  let turning_away = 0;
  let turning_against = 0;

  const positiveResponses = ['yes', 'yeah', 'sure', 'sounds good', 'i\'d love to', 'absolutely'];
  const neutralResponses = ['ok', 'okay', 'fine', 'maybe', 'i guess'];
  const negativeResponses = ['no', 'not now', 'busy', 'can\'t', 'don\'t want'];

  positiveResponses.forEach(response => {
    if (textLower.includes(response)) turning_toward++;
  });

  neutralResponses.forEach(response => {
    if (textLower.includes(response)) turning_away++;
  });

  negativeResponses.forEach(response => {
    if (textLower.includes(response)) turning_against++;
  });

  // Four Horsemen detection
  let criticism = 0;
  let defensiveness = 0;
  let stonewalling = 0;
  let repair_attempts = 0;

  // Criticism patterns
  if (textLower.includes('you always') || textLower.includes('you never')) criticism++;
  if (textLower.includes('you should') || textLower.includes('why don\'t you')) criticism++;

  // Defensiveness patterns
  if (textLower.includes('but ') || textLower.includes('however')) defensiveness++;
  if (textLower.includes('that\'s not true') || textLower.includes('i never said')) defensiveness++;

  // Stonewalling patterns
  if (textLower.includes('whatever') || textLower.includes('fine')) {
    // Only count as stonewalling if it's a standalone response
    const words = text.trim().split(/\s+/);
    if (words.length <= 3) stonewalling++;
  }

  // Repair attempts
  if (textLower.includes('sorry') || textLower.includes('apologize')) repair_attempts++;
  if (textLower.includes('let me try again') || textLower.includes('can we start over')) repair_attempts++;

  return {
    bids,
    turning_toward,
    turning_away,
    turning_against,
    criticism,
    defensiveness,
    stonewalling,
    repair_attempts
  };
};

const analyzeNVCPatterns = (text: string, messages: any[]) => {
  const textLower = text.toLowerCase();
  
  // Observation
  let observation = 'Conversation analyzed for communication patterns';
  if (messages.length > 0) {
    observation = `${messages.length} messages exchanged between participants`;
  }

  // Feeling
  let feeling = 'Mixed emotional tone detected';
  const feelingWords = ['feel', 'feeling', 'felt', 'happy', 'sad', 'frustrated', 'excited', 'worried', 'angry'];
  const detectedFeelings = feelingWords.filter(word => textLower.includes(word));
  if (detectedFeelings.length > 0) {
    feeling = `Emotional expressions detected: ${detectedFeelings.join(', ')}`;
  }

  // Need
  let need = 'Connection and understanding between participants';
  if (textLower.includes('need') || textLower.includes('want')) {
    need = 'Specific needs and wants expressed in conversation';
  }

  // Request
  let request = 'Continue practicing mindful communication';
  if (text.includes('?')) {
    request = 'Questions asked - seeking information or connection';
  }

  return {
    observation,
    feeling,
    need,
    request
  };
};

const detectCommunicationPatterns = (text: string, messages: any[]) => {
  const patterns = [];
  const textLower = text.toLowerCase();

  if (text.includes('?')) {
    patterns.push('Asking questions - shows curiosity and engagement');
  }

  if (textLower.includes('thank') || textLower.includes('appreciate')) {
    patterns.push('Expressing gratitude - builds positive connection');
  }

  if (textLower.includes('sorry') || textLower.includes('apologize')) {
    patterns.push('Taking responsibility - shows accountability');
  }

  if (textLower.includes('feel') || textLower.includes('feeling')) {
    patterns.push('Sharing emotions - creates vulnerability and connection');
  }

  if (textLower.includes('i understand') || textLower.includes('i can see')) {
    patterns.push('Showing validation - demonstrates empathy and understanding');
  }

  if (textLower.includes('let\'s') || textLower.includes('we could')) {
    patterns.push('Collaborative language - building partnership');
  }

  return patterns;
};

const assessCommunicationRisks = (text: string, messages: any[]) => {
  const risks = [];
  const textLower = text.toLowerCase();

  if (textLower.includes('always') || textLower.includes('never')) {
    risks.push('Absolute language detected - try using "sometimes" or "often" instead');
  }

  if (textLower.includes('but ') || textLower.includes('however')) {
    risks.push('Defensive language patterns - consider using "and" instead of "but"');
  }

  if (textLower.includes('you should') || textLower.includes('you need to')) {
    risks.push('Directive language - try "I would appreciate" or "It would help if"');
  }

  const negativeWords = ['hate', 'stupid', 'ridiculous', 'pathetic'];
  if (negativeWords.some(word => textLower.includes(word))) {
    risks.push('Strong negative language - consider softer alternatives');
  }

  return risks;
};

const generateSuggestions = (goal: string, highlights: any[], analysis: any) => {
  const suggestions = [];
  let suggestionId = 1;
  
  // Goal-based suggestions
  const goalSuggestions: { [key: string]: any[] } = {
    'reconnect': [
      {
        text: "I've been thinking about you and wanted to check in. How have you been feeling lately?",
        style: 'warm',
        rationale: 'Shows care and opens space for emotional connection',
        framework: 'Gottman Method'
      },
      {
        text: "I really value our relationship and want to make sure we're good. Can we talk?",
        style: 'direct',
        rationale: 'Direct but caring approach that prioritizes the relationship',
        framework: 'NVC'
      }
    ],
    'clarify': [
      {
        text: "I want to make sure I understand what you're saying. Can you help me see this from your perspective?",
        style: 'curious',
        rationale: 'Shows genuine interest in understanding rather than being right',
        framework: 'NVC'
      },
      {
        text: "I think we might be seeing this differently. Let me share what I heard and you can correct me if I'm off.",
        style: 'collaborative',
        rationale: 'Invites collaboration and shows willingness to be wrong',
        framework: 'Gottman Method'
      }
    ],
    'apologize': [
      {
        text: "I realize I hurt you with what I said/did, and I'm truly sorry. That wasn't my intention, but I understand the impact.",
        style: 'accountable',
        rationale: 'Takes responsibility without making excuses',
        framework: 'Gottman Repair'
      },
      {
        text: "I messed up and I want to make this right. What do you need from me?",
        style: 'direct',
        rationale: 'Shows accountability and asks how to repair',
        framework: 'NVC'
      }
    ],
    'boundary': [
      {
        text: "I care about our relationship, and I need to share something that's important to me.",
        style: 'caring',
        rationale: 'Frames boundary-setting as caring for the relationship',
        framework: 'NVC'
      },
      {
        text: "I've noticed I feel [feeling] when [situation]. I'd appreciate if we could [request].",
        style: 'structured',
        rationale: 'Uses NVC format to communicate needs clearly',
        framework: 'NVC'
      }
    ],
    'conflict': [
      {
        text: "I can see this is really important to you. Help me understand what you need right now.",
        style: 'validating',
        rationale: 'Validates their experience and seeks to understand',
        framework: 'De-escalation'
      },
      {
        text: "We both care about this relationship. Let's take a step back and figure this out together.",
        style: 'collaborative',
        rationale: 'Reminds both parties of shared values',
        framework: 'Gottman Method'
      }
    ]
  };
  
  // Add goal-specific suggestions
  if (goalSuggestions[goal]) {
    goalSuggestions[goal].forEach(suggestion => {
      suggestions.push({ ...suggestion, id: suggestionId++ });
    });
  }
  
  // Add suggestions based on analysis
  if (analysis.frameworks.gottman.criticism > 0) {
    suggestions.push({
      id: suggestionId++,
      text: "I feel [emotion] when [specific behavior happens]. I need [specific need].",
      style: 'structured',
      rationale: 'Uses "I" statements to express concerns without attacking character',
      framework: 'Gottman Method - Avoiding Criticism'
    });
  }
  
  if (analysis.frameworks.gottman.defensiveness > 0) {
    suggestions.push({
      id: suggestionId++,
      text: "You're right that I contributed to this. Let me take responsibility for my part.",
      style: 'accountable',
      rationale: 'Takes responsibility instead of defending, which de-escalates conflict',
      framework: 'Gottman Method - Overcoming Defensiveness'
    });
  }
  
  if (analysis.frameworks.gottman.bids > 0 && analysis.frameworks.gottman.turning_toward === 0) {
    suggestions.push({
      id: suggestionId++,
      text: "That sounds really interesting! Tell me more about that.",
      style: 'engaged',
      rationale: 'Shows enthusiasm for their bids for connection',
      framework: 'Gottman Method'
    });
  }

  // Ensure we have at least 3 suggestions
  while (suggestions.length < 3) {
    suggestions.push({
      id: suggestionId++,
      text: "I appreciate you sharing this with me. How can I best support you right now?",
      style: 'supportive',
      rationale: 'Shows care and asks how to help',
      framework: 'Supportive Communication'
    });
  }
  
  return suggestions.slice(0, 4); // Limit to 4 suggestions
};