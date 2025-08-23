export interface CommunicationPattern {
  pattern: string;
  category: string;
  explanation: string;
  suggestion: string;
}

export interface ResponsePattern {
  patterns: string[];
  type: 'response-toward' | 'response-away' | 'response-against';
  category: string;
  explanation: string;
  suggestion: string;
}

export interface PositivePattern {
  patterns: string[];
  category: string;
  explanation: string;
  suggestion: string;
}

export interface ConcernPattern {
  patterns: string[];
  category: string;
  explanation: string;
  suggestion: string;
}

export const bidPatterns: CommunicationPattern[] = [
  { pattern: 'how are', category: 'Question Bid', explanation: 'This is a "bid" - an attempt to connect. Responding positively builds relationship strength.', suggestion: 'Great question! This shows genuine interest. Consider following up with active listening.' },
  { pattern: 'how was', category: 'Question Bid', explanation: 'This shows genuine interest in their experience.', suggestion: 'Perfect way to show you care about their day. Follow up with "Tell me more about that."' },
  { pattern: 'what do', category: 'Question Bid', explanation: 'Asking questions shows curiosity and care.', suggestion: 'Good question! Shows you value their opinion. Listen actively to their response.' },
  { pattern: 'how did', category: 'Question Bid', explanation: 'Following up on their experiences builds connection.', suggestion: 'Nice follow-up question! This shows you remember and care about their experiences.' },
  { pattern: 'tell me', category: 'Question Bid', explanation: 'Inviting them to share creates intimacy.', suggestion: 'Excellent invitation to share! This creates space for deeper connection.' },
  { pattern: 'what happened', category: 'Question Bid', explanation: 'Showing interest in their story builds bonds.', suggestion: 'Great way to show concern and interest. Listen without trying to fix unless they ask.' },
  { pattern: 'want to', category: 'Activity Bid', explanation: 'This is a "bid" - an attempt to connect through shared activity.', suggestion: 'Nice invitation! This shows you want to spend quality time together.' },
  { pattern: 'let\'s', category: 'Activity Bid', explanation: 'Suggesting activities together builds shared experiences.', suggestion: 'Great collaborative approach! This builds partnership and shared memories.' },
  { pattern: 'should we', category: 'Activity Bid', explanation: 'Collaborative planning strengthens partnerships.', suggestion: 'Perfect collaborative language! This shows you see them as an equal partner.' },
  { pattern: 'i feel', category: 'Emotional Bid', explanation: 'Sharing feelings is vulnerable and builds connection.', suggestion: 'Brave emotional sharing! This vulnerability creates deeper intimacy.' },
  { pattern: 'i think', category: 'Emotional Bid', explanation: 'Sharing thoughts creates intellectual intimacy.', suggestion: 'Good way to share your perspective while staying open to theirs.' },
  { pattern: 'i\'m excited', category: 'Emotional Bid', explanation: 'Sharing positive emotions invites others to celebrate with you.', suggestion: 'Beautiful enthusiasm! This invites them to share in your joy.' },
  { pattern: 'i\'m worried', category: 'Emotional Bid', explanation: 'Sharing concerns invites support and understanding.', suggestion: 'Honest vulnerability. This opens the door for support and comfort.' },
  { pattern: 'i love', category: 'Emotional Bid', explanation: 'Expressing love and appreciation strengthens bonds.', suggestion: 'Wonderful expression of appreciation! This builds positive emotional connection.' },
  { pattern: 'i\'m sorry for', category: 'Specific Apology', explanation: 'Taking specific responsibility shows maturity and care for the relationship.', suggestion: 'Excellent specific apology! This shows you understand exactly how you affected them.' },
  { pattern: 'i\'m sorry that i', category: 'Specific Apology', explanation: 'Taking personal responsibility for your actions shows accountability.', suggestion: 'Perfect accountability! This shows you understand your role in what happened.' },
  { pattern: 'my bad', category: 'Repair Attempt', explanation: 'Informal but genuine acknowledgment of responsibility.', suggestion: 'Taking responsibility is mature. Consider being more specific about what you\'ll do differently.' }
];

export const responsePatterns: ResponsePattern[] = [
  { 
    patterns: ['yes', 'yeah', 'sure', 'sounds good', 'i\'d love to', 'that sounds', 'absolutely', 'definitely'], 
    type: 'response-toward', 
    category: 'Turning Toward', 
    explanation: 'This positive response builds connection and shows engagement.', 
    suggestion: 'Perfect! Keep showing this enthusiasm for their bids.' 
  },
  { 
    patterns: ['ok', 'okay', 'fine', 'maybe', 'i guess'], 
    type: 'response-away', 
    category: 'Turning Away', 
    explanation: 'This brief response may miss the connection opportunity.', 
    suggestion: 'Consider showing more engagement: "That sounds interesting, tell me more!"' 
  },
  { 
    patterns: ['not now', 'busy', 'can\'t', 'don\'t want'], 
    type: 'response-against', 
    category: 'Turning Against', 
    explanation: 'This response may damage the relationship connection.', 
    suggestion: 'Try: "I can\'t right now, but I\'d love to talk about this later. When works for you?"' 
  }
];

export const positivePatterns: PositivePattern[] = [
  { 
    patterns: ['thank you', 'thanks', 'appreciate'], 
    category: 'Appreciation', 
    explanation: 'Expressing gratitude strengthens relationships and creates positive connection.', 
    suggestion: 'Keep expressing specific appreciation like this - it builds strong emotional bonds!' 
  },
  { 
    patterns: ['i understand', 'that makes sense', 'i can see'], 
    category: 'Validation', 
    explanation: 'Acknowledging their perspective creates emotional safety and shows you care.', 
    suggestion: 'Excellent validation! Continue showing this level of empathy and understanding.' 
  },
  { 
    patterns: ['sorry that happened', 'sorry to hear that', 'i\'m sorry that happened', 'sorry you\'re going through', 'i\'m sorry you\'re', 'sorry you had to'], 
    category: 'Empathy/Sympathy', 
    explanation: 'Expressing empathy for someone else\'s difficult experience shows genuine care and emotional intelligence.', 
    suggestion: 'Beautiful empathy! This kind of genuine care strengthens your connection.' 
  },
  { 
    patterns: ['let me try again', 'can we start over', 'i want to understand', 'help me get this right'], 
    category: 'Repair Attempt', 
    explanation: 'Attempting to repair and reconnect shows emotional maturity and commitment to the relationship.', 
    suggestion: 'Fantastic repair attempt! You\'re prioritizing the relationship - keep doing this.' 
  },
  { 
    patterns: ['especially for'], 
    category: 'Specific Accountability', 
    explanation: 'Being specific about your actions shows deep accountability and understanding of impact.', 
    suggestion: 'Outstanding accountability! This shows you understand exactly how your actions affected them.' 
  },
  { 
    patterns: ['stressing you out'], 
    category: 'Impact Awareness', 
    explanation: 'Acknowledging the specific emotional impact shows high emotional intelligence.', 
    suggestion: 'Perfect impact awareness! This shows you truly understand how they felt.' 
  }
];

export const concernPatterns: ConcernPattern[] = [
  { 
    patterns: ['but ', 'however', 'actually'], 
    category: 'Defensive Language', 
    explanation: 'This language pattern might create distance or defensiveness.', 
    suggestion: 'Try: "I hear you, and I also think..." instead of "but" to sound less dismissive.' 
  },
  { 
    patterns: ['you always', 'you never'], 
    category: 'Criticism Pattern', 
    explanation: 'Absolute statements can trigger defensiveness.', 
    suggestion: 'Try: "I feel hurt when this happens" instead of "you always/never"' 
  },
  { 
    patterns: ['you should', 'you need to', 'why don\'t you', 'why can\'t you'], 
    category: 'Criticism Pattern', 
    explanation: 'These phrases can sound critical and judgmental.', 
    suggestion: 'Try: "I would appreciate if..." or "It would help me if..."' 
  },
  { 
    patterns: ['that\'s not true', 'i never said that', 'you\'re wrong', 'that\'s ridiculous'], 
    category: 'Defensiveness Pattern', 
    explanation: 'Defensive responses can escalate conflict and prevent understanding.', 
    suggestion: 'Try: "I see it differently" or "Help me understand your perspective"' 
  },
  { 
    patterns: ['i don\'t want to talk', 'leave me alone', 'i\'m done', 'forget it'], 
    category: 'Stonewalling Pattern', 
    explanation: 'Withdrawing from conversation can damage connection over time.', 
    suggestion: 'Try: "I need a break to process this. Can we talk in 20 minutes?"' 
  },
  { 
    patterns: ['whatever', 'fine'], 
    category: 'Dismissive Language', 
    explanation: 'These responses might signal disconnection.', 
    suggestion: 'If you\'re overwhelmed, try: "I need a moment to process this thoughtfully."' 
  }
];

export const fallbackSuggestions = {
  apology: 'This apology shows care for the relationship. You might add what you\'ll do differently next time.',
  gratitude: 'Beautiful gratitude! This kind of appreciation strengthens relationships.',
  emotion: 'Sharing feelings creates emotional connection. Consider following up with what you need.',
  question: 'Good question! This shows interest. Listen actively to their full response.',
  affection: 'Expressing care like this builds emotional safety and connection.',
  default: 'Consider how you might respond with more curiosity, validation, or appreciation.'
};