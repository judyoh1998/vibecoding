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
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Explicitly initialize all variables at function entry point
  let parsedMessages: any[] = [];
  let interactiveHighlights: any[] = [];
  let bidCount: number = 0;
  let turningToward: number = 0;
  let turningAway: number = 0;
  let turningAgainst: number = 0;
  let criticismCount: number = 0;
  let defensivenessCount: number = 0;
  let stonewallingCount: number = 0;
  let repairAttempts: number = 0;
  let bidTypes: string[] = [];
  let concernTypes: string[] = [];
  let opportunityTypes: string[] = [];
  
  try {
    // Parse the conversation
    const parsed = parseConversation(currentSnippet);
    parsedMessages = parsed.messages;
    
    // Generate interactive highlights first
    interactiveHighlights = generateInteractiveHighlights(parsedMessages, null);
    
    // Count actual bids and responses from the interactive analysis
    bidCount = interactiveHighlights.filter(h => h.type === 'bid').length;
    turningToward = interactiveHighlights.filter(h => h.type === 'response-toward').length;
    turningAway = interactiveHighlights.filter(h => h.type === 'response-away').length;
    turningAgainst = interactiveHighlights.filter(h => h.type === 'response-against').length;
    
    // Count Four Horsemen and Repair Attempts
    criticismCount = interactiveHighlights.filter(h => 
      h.type === 'concern' && h.category === 'Criticism Pattern'
    ).length;
    defensivenessCount = interactiveHighlights.filter(h => 
      h.type === 'concern' && h.category === 'Defensiveness Pattern'
    ).length;
    stonewallingCount = interactiveHighlights.filter(h => 
      h.type === 'concern' && (h.category === 'Stonewalling Pattern' || h.category === 'Dismissive Language')
    ).length;
    repairAttempts = interactiveHighlights.filter(h => 
      h.category === 'Repair Attempt' || h.category === 'Specific Apology'
    ).length;
    
    // Analyze patterns from highlights
    bidTypes = interactiveHighlights.filter(h => h.type === 'bid').map(h => h.category);
    concernTypes = interactiveHighlights.filter(h => h.type === 'concern').map(h => h.category);
    opportunityTypes = interactiveHighlights.filter(h => h.type === 'opportunity').map(h => h.category);
  } catch (error) {
    console.error('Error during conversation analysis:', error);
    // Variables are already initialized to default values above
  }
  
  // Extract patterns from the interactive analysis
  const detectedPatterns = [];
  const risks = [];
  
  if (bidCount > 0) {
    detectedPatterns.push(`${bidCount} bids for connection detected`);
    if (bidTypes.includes('Question Bid')) {
      detectedPatterns.push('Active questioning pattern - shows curiosity');
    }
    if (bidTypes.includes('Emotional Bid')) {
      detectedPatterns.push('Emotional sharing present - builds intimacy');
    }
    if (bidTypes.includes('Activity Bid')) {
      detectedPatterns.push('Activity invitations - seeks shared experiences');
    }
  }
  
  if (turningToward > 0) {
    detectedPatterns.push(`${turningToward} positive responses to bids`);
  }
  
  if (opportunityTypes.includes('Appreciation')) {
    detectedPatterns.push('Gratitude expressions detected - strengthens bonds');
  }
  
  if (opportunityTypes.includes('Validation')) {
    detectedPatterns.push('Validation language present - creates safety');
  }
  
  // Add concerns as risks
  if (concernTypes.includes('Defensive Language')) {
    risks.push('Defensive language patterns detected - consider using "and" instead of "but"');
  }
  
  if (concernTypes.includes('Criticism Pattern')) {
    risks.push('Criticism patterns found - try "I" statements to reduce defensiveness');
  }
  
  if (concernTypes.includes('Dismissive Language')) {
    risks.push('Dismissive responses detected - consider showing more engagement');
  }
  
  if (turningAway > turningToward) {
    risks.push('More neutral responses than positive ones - try showing more enthusiasm for bids');
  }

  // Add default patterns if none detected
  if (detectedPatterns.length === 0) {
    detectedPatterns.push('Conversation analyzed - see highlights for specific moments');
  }

  // Calculate sentiment based on actual highlights
  const positiveCount = interactiveHighlights.filter(h => 
    h.type === 'response-toward' || h.category === 'Appreciation' || h.category === 'Validation'
  ).length;
  const negativeCount = interactiveHighlights.filter(h => 
    h.type === 'response-against' || h.type === 'concern'
  ).length;
  const neutralCount = interactiveHighlights.filter(h => 
    h.type === 'response-away'
  ).length;

  let sentimentScore = 0;
  let sentimentLabel = 'Neutral';

  const totalEmotionalSignals = positiveCount + negativeCount + neutralCount;

  if (totalEmotionalSignals > 0) {
    sentimentScore = (positiveCount - negativeCount) / totalEmotionalSignals;
    sentimentLabel = sentimentScore > 0.5 ? 'Positive' : 'Slightly Positive';
  } else if (sentimentScore < -0.2) {
    sentimentLabel = sentimentScore < -0.5 ? 'Negative' : 'Slightly Negative';
  } else {
    sentimentLabel = 'Neutral';
  }

  // Determine tone from highlights
  const tones = [];
  if (bidTypes.includes('Question Bid')) tones.push('Curious');
  if (opportunityTypes.includes('Appreciation')) tones.push('Appreciative');
  if (opportunityTypes.includes('Validation')) tones.push('Supportive');
  if (bidTypes.includes('Emotional Bid')) tones.push('Open');
  if (concernTypes.length > 0) tones.push('Tense');
  if (neutralCount > positiveCount) tones.push('Reserved');
  if (tones.length === 0) tones.push('Conversational');

  // Create analysis results
  const analysis = {
    sentiment: { score: sentimentScore, label: sentimentLabel },
    tone: tones,
    frameworks: {
      nvc: {
        observation: bidCount > 0 ? 
          `${bidCount} connection attempts and ${turningToward + turningAway + turningAgainst} responses observed` :
          'Limited connection attempts observed in this conversation',
        feeling: risks.length > 0 ? 
          'Some tension or disconnection patterns detected' : 
          positiveCount > 0 ? 'Positive emotional tone present' : 'Neutral emotional tone',
        need: bidCount > turningToward ? 
          'More positive engagement with connection attempts' : 
          'Continued mutual understanding and connection',
        request: risks.length > 0 ? 
          'Consider more validating and connecting responses' :
          'Keep building on the positive communication patterns'
      },
      gottman: {
        bids: bidCount,
        turning_toward: turningToward,
        turning_away: turningAway,
        turning_against: turningAgainst,
        criticism: criticismCount,
        defensiveness: defensivenessCount,
        stonewalling: stonewallingCount,
        repair_attempts: repairAttempts
      }
    },
    patterns: detectedPatterns,
    risks: risks
  };

  // Generate suggestions based on the goal and detected patterns
  const suggestions = generateSuggestions(currentGoal, interactiveHighlights, analysis, {
    turningAway,
    turningAgainst
  });

  // Generate highlights based on the parsed conversation
  const conversationHighlights = generateHighlights(parsedMessages, analysis);

  return {
    analysis,
    suggestions,
    highlights: conversationHighlights,
    interactiveHighlights,
    parsedMessages
  };
};

const generateSuggestions = (goal: string, highlights: any[], analysis: any, counts?: { turningAway: number; turningAgainst: number }) => {
  const suggestions = [];
  let suggestionId = 1;
  
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
  
  if (analysis.frameworks.gottman.stonewalling > 0) {
    suggestions.push({
      id: suggestionId++,
      text: "I'm feeling overwhelmed and need a 20-minute break to collect my thoughts. Then I'd like to continue this conversation.",
      style: 'self-aware',
      rationale: 'Communicates need for space while committing to return to the conversation',
      framework: 'Gottman Method - Preventing Stonewalling'
    });
  }
  
  if (analysis.frameworks.gottman.repair_attempts === 0 && (turningAway > 0 || turningAgainst > 0)) {
    suggestions.push({
      id: suggestionId++,
      text: "I can see this conversation isn't going well. Can we pause and try a different approach?",
      style: 'repair',
      rationale: 'Initiates repair when conversation is going off track',
      framework: 'Gottman Method - Repair Attempts'
    });
  }
  
  if (bidHighlights.length > 0 && analysis.frameworks.gottman.turning_toward === 0) {
    suggestions.push({
      id: suggestionId++,
      text: "That sounds really interesting! Tell me more about that.",
      style: 'engaged',
      rationale: 'Shows enthusiasm for their bids for connection',
      framework: 'Gottman Method'
    });
  }
  
  if (analysis.frameworks.gottman.repair_attempts === 0 && (analysis.frameworks.gottman.turning_away > 0 || analysis.frameworks.gottman.turning_against > 0)) {
    suggestions.push({
      id: suggestionId++,
      text: "I can see this conversation isn't going well. Can we pause and try a different approach?",
      style: 'repair',
      rationale: 'Initiates repair when conversation is going off track',
      framework: 'Gottman Method - Repair Attempts'
    });
  }
  
  if ((counts?.turningAway || analysis.frameworks.gottman.turning_away) > analysis.frameworks.gottman.turning_toward) {
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