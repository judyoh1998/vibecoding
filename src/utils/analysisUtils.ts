import { parseConversation, generateHighlights, generateInteractiveHighlights } from './conversationParser';

const API_BASE_URL = 'http://localhost:8000';

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
  try {
    // Call the Python backend API
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: currentSnippet,
        goal: currentGoal
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      analysis: result.analysis,
      suggestions: result.suggestions,
      highlights: result.highlights,
      interactiveHighlights: result.interactiveHighlights,
      parsedMessages: result.parsedMessages
    };
    
  } catch (error) {










    console.error('Error calling backend API:', error);
    
    // Fallback to local analysis if backend is unavailable
    console.log('Falling back to local analysis...');
    return await analyzeConversationLocally(currentSnippet, currentGoal);
  }
};

// Fallback function using the original local analysis
const analyzeConversationLocally = async (
  currentSnippet: string, 
  currentGoal: string
): Promise<AnalysisResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Use the original parsing logic as fallback
  const parsed = parseConversation(currentSnippet);
  const parsedMessages = parsed.messages;
  const interactiveHighlights = generateInteractiveHighlights(parsedMessages, null);
  
  // Simple analysis for fallback
  const analysis = {
    sentiment: { score: 0.1, label: 'Slightly Positive' },
    tone: ['Conversational'],
    frameworks: {
      nvc: {
        observation: `${parsedMessages.length} messages analyzed locally`,
        feeling: 'Neutral emotional tone',
        need: 'Connection and understanding',
        request: 'Continue building positive communication'
      },
      gottman: {
        bids: 1,
        turning_toward: 1,
        turning_away: 0,
        turning_against: 0,
        criticism: 0,
        defensiveness: 0,
        stonewalling: 0,
        repair_attempts: 0
      }
    },
    patterns: ['Local analysis - backend unavailable'],
    risks: []
  };

  const suggestions = [{
    id: 1,
    text: "I want to understand your perspective better. Can you help me see this from your point of view?",
    style: "curious",
    rationale: "Shows genuine interest in understanding",
    framework: "Active Listening"
  }];

  const highlights = generateHighlights(parsedMessages, analysis);

  return {
    analysis,
    suggestions,
    highlights,
    interactiveHighlights,
    parsedMessages
  };
};

const generateSuggestions = (goal: string, highlights: any[], analysis: any, counts?: { turningAway: number; turningAgainst: number }) => {
  const suggestions = [];
  let suggestionId = 1;
  
  // Safely initialize all count variables with default values
  const turningAwayCount = counts?.turningAway ?? analysis?.frameworks?.gottman?.turning_away ?? 0;
  const turningAgainstCount = counts?.turningAgainst ?? analysis?.frameworks?.gottman?.turning_against ?? 0;
  const turningTowardCount = analysis?.frameworks?.gottman?.turning_toward ?? 0;
  const criticismCount = analysis?.frameworks?.gottman?.criticism ?? 0;
  const defensivenessCount = analysis?.frameworks?.gottman?.defensiveness ?? 0;
  const stonewallingCount = analysis?.frameworks?.gottman?.stonewalling ?? 0;
  const repairAttemptsCount = analysis?.frameworks?.gottman?.repair_attempts ?? 0;
  const bidsCount = analysis?.frameworks?.gottman?.bids ?? 0;
  
  // Goal-based suggestions
  const goalSuggestions = {
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
  
  // Add suggestions based on detected patterns
  const concernHighlights = highlights.filter(h => h.type === 'concern');
  const bidHighlights = highlights.filter(h => h.type === 'bid');
  
  if (concernHighlights.some(h => h.category === 'Defensive Language')) {
    suggestions.push({
      id: suggestionId++,
      text: "I understand your perspective, and here's how I see it...",
      style: 'collaborative',
      rationale: 'Replaces "but" with "and" to sound less dismissive',
      framework: 'Communication Skills'
    });
  }
  
  // Add suggestions based on Four Horsemen detection
  if (criticismCount > 0) {
    suggestions.push({
      id: suggestionId++,
      text: "I feel [emotion] when [specific behavior happens]. I need [specific need].",
      style: 'structured',
      rationale: 'Uses "I" statements to express concerns without attacking character',
      framework: 'Gottman Method - Avoiding Criticism'
    });
  }
  
  if (defensivenessCount > 0) {
    suggestions.push({
      id: suggestionId++,
      text: "You're right that I contributed to this. Let me take responsibility for my part.",
      style: 'accountable',
      rationale: 'Takes responsibility instead of defending, which de-escalates conflict',
      framework: 'Gottman Method - Overcoming Defensiveness'
    });
  }
  
  if (stonewallingCount > 0) {
    suggestions.push({
      id: suggestionId++,
      text: "I'm feeling overwhelmed and need a 20-minute break to collect my thoughts. Then I'd like to continue this conversation.",
      style: 'self-aware',
      rationale: 'Communicates need for space while committing to return to the conversation',
      framework: 'Gottman Method - Preventing Stonewalling'
    });
  }
  
  if (repairAttemptsCount === 0 && (turningAwayCount > 0 || turningAgainstCount > 0)) {
    suggestions.push({
      id: suggestionId++,
      text: "I can see this conversation isn't going well. Can we pause and try a different approach?",
      style: 'repair',
      rationale: 'Initiates repair when conversation is going off track',
      framework: 'Gottman Method - Repair Attempts'
    });
  }
  
  if (bidHighlights.length > 0 && turningTowardCount === 0) {
    suggestions.push({
      id: suggestionId++,
      text: "That sounds really interesting! Tell me more about that.",
      style: 'engaged',
      rationale: 'Shows enthusiasm for their bids for connection',
      framework: 'Gottman Method'
    });
  }
  
  if (repairAttemptsCount === 0 && (turningAwayCount > 0 || turningAgainstCount > 0)) {
    suggestions.push({
      id: suggestionId++,
      text: "I can see this conversation isn't going well. Can we pause and try a different approach?",
      style: 'repair',
      rationale: 'Initiates repair when conversation is going off track',
      framework: 'Gottman Method - Repair Attempts'
    });
  }
  
  if (turningAwayCount > turningTowardCount) {
    suggestions.push({
      id: suggestionId++,
      text: "I want to give this the attention it deserves. Can you help me understand why this matters to you?",
      style: 'attentive',
      rationale: 'Shows you want to engage more fully with their concerns',
      framework: 'Active Listening'
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