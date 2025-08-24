export interface ParsedMessage {
  id: string;
  speaker: string;
  text: string;
  timestamp?: string;
  isUser?: boolean;
}

export interface ParsedConversation {
  messages: ParsedMessage[];
  speakers: string[];
}

export const parseConversation = (text: string): ParsedConversation => {
  const lines = text.trim().split('\n');
  const messages: ParsedMessage[] = [];
  const speakers: string[] = [];
  let messageId = 0;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    // Try to detect speaker patterns (Speaker: message)
    const colonMatch = trimmedLine.match(/^([^:]+):\s*(.+)$/);
    if (colonMatch) {
      const speaker = colonMatch[1].trim();
      const messageText = colonMatch[2].trim();
      
      if (!speakers.includes(speaker)) {
        speakers.push(speaker);
      }
      
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
  
  return { messages, speakers };
};

export const generateHighlights = (messages: ParsedMessage[], analysis: any) => {
  const highlights = [];
  let highlightId = 0;
  
  for (const message of messages) {
    const text = message.text.toLowerCase();
    
    // Check for positive patterns
    if (text.includes('thank') || text.includes('appreciate')) {
      highlights.push({
        id: `highlight-${highlightId}`,
        text: message.text,
        speaker: message.speaker,
        type: 'positive',
        category: 'Appreciation',
        explanation: 'Expressing gratitude strengthens relationships and creates positive connection.'
      });
      highlightId++;
    }
    
    // Check for questions (bids for connection)
    if (message.text.includes('?')) {
      highlights.push({
        id: `highlight-${highlightId}`,
        text: message.text,
        speaker: message.speaker,
        type: 'opportunity',
        category: 'Bid for Connection',
        explanation: 'Questions are "bids" for connection. Responding positively builds relationship strength.'
      });
      highlightId++;
    }
    
    // Check for apologies
    if (text.includes('sorry') || text.includes('apologize')) {
      highlights.push({
        id: `highlight-${highlightId}`,
        text: message.text,
        speaker: message.speaker,
        type: 'positive',
        category: 'Repair Attempt',
        explanation: 'Taking responsibility and apologizing shows emotional maturity and care for the relationship.'
      });
      highlightId++;
    }
  }
  
  return highlights;
};

export const generateInteractiveHighlights = (messages: ParsedMessage[], analysis: any) => {
  const highlights = [];
  let highlightId = 0;
  
  for (const message of messages) {
    const text = message.text;
    const textLower = text.toLowerCase();
    
    // Find appreciation words
    const appreciationWords = ['thank', 'thanks', 'appreciate'];
    for (const word of appreciationWords) {
      if (textLower.includes(word)) {
        const startIndex = textLower.indexOf(word);
        highlights.push({
          id: `highlight-${highlightId}`,
          messageId: message.id,
          startIndex,
          endIndex: startIndex + word.length,
          type: 'opportunity',
          category: 'Appreciation',
          explanation: 'Expressing gratitude strengthens relationships',
          suggestion: 'Keep expressing specific appreciation like this - it builds strong emotional bonds!',
          originalText: text.slice(startIndex, startIndex + word.length)
        });
        highlightId++;
        break;
      }
    }
    
    // Find question patterns
    if (text.includes('?')) {
      const questionIndex = text.indexOf('?');
      // Find the start of the question (look for common question words)
      const questionWords = ['how', 'what', 'when', 'where', 'why', 'who', 'can', 'could', 'would', 'should', 'do', 'did', 'are', 'is'];
      let startIndex = 0;
      
      for (const qWord of questionWords) {
        const qIndex = textLower.indexOf(qWord);
        if (qIndex !== -1 && qIndex < questionIndex) {
          startIndex = qIndex;
          break;
        }
      }
      
      highlights.push({
        id: `highlight-${highlightId}`,
        messageId: message.id,
        startIndex,
        endIndex: questionIndex + 1,
        type: 'bid',
        category: 'Question Bid',
        explanation: 'This is a "bid" for connection - an attempt to engage and connect',
        suggestion: 'Great question! This shows genuine interest. Consider following up with active listening.',
        originalText: text.slice(startIndex, questionIndex + 1)
      });
      highlightId++;
    }
  }
  
  return highlights;
};