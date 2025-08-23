from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import re
from datetime import datetime

app = FastAPI(title="BetterFriend NLP API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class ConversationRequest(BaseModel):
    text: str
    goal: str

class Message(BaseModel):
    id: str
    speaker: str
    text: str
    timestamp: str = None
    isUser: bool = False

class Highlight(BaseModel):
    id: str
    messageId: str
    startIndex: int
    endIndex: int
    type: str
    category: str
    explanation: str
    suggestion: str = None
    originalText: str

class NVCFramework(BaseModel):
    observation: str
    feeling: str
    need: str
    request: str

class GottmanFramework(BaseModel):
    bids: int
    turning_toward: int
    turning_away: int
    turning_against: int
    criticism: int
    defensiveness: int
    stonewalling: int
    repair_attempts: int

class Frameworks(BaseModel):
    nvc: NVCFramework
    gottman: GottmanFramework

class Sentiment(BaseModel):
    score: float
    label: str

class Analysis(BaseModel):
    sentiment: Sentiment
    tone: List[str]
    frameworks: Frameworks
    patterns: List[str]
    risks: List[str]

class Suggestion(BaseModel):
    id: int
    text: str
    style: str
    rationale: str
    framework: str

class AnalysisResponse(BaseModel):
    analysis: Analysis
    suggestions: List[Suggestion]
    highlights: List[Dict[str, Any]]
    interactiveHighlights: List[Highlight]
    parsedMessages: List[Message]

# NLP Analysis Functions
def parse_conversation(text: str) -> tuple[List[Message], float]:
    """Parse conversation text into structured messages"""
    lines = text.strip().split('\n')
    messages = []
    confidence = 0.0
    message_id = 0
    
    # Enhanced patterns for conversation parsing
    patterns = [
        # WhatsApp: "[10:30 AM] John: Hey there"
        (r'^\[([^\]]+)\]\s*([^:]+?):\s*(.+)$', 'WhatsApp', 0.9),
        # Standard: "John: Hey there"
        (r'^\b([^:]+?)\b\s*:\s*(.+)$', 'Standard', 0.8),
        # Simple names: "Me: Hi" or "Friend: Hello"
        (r'^(Me|You|Friend|Partner|Mom|Dad|Boss|[A-Z][a-z]{2,15}):\s*(.+)$', 'Simple', 0.6),
    ]
    
    total_confidence = 0
    pattern_matches = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        matched = False
        for pattern, platform, conf in patterns:
            match = re.match(pattern, line)
            if match:
                if len(match.groups()) == 3:  # WhatsApp format
                    timestamp, speaker, text = match.groups()
                    messages.append(Message(
                        id=f"msg-{message_id}",
                        speaker=speaker.strip(),
                        text=text.strip(),
                        timestamp=timestamp.strip(),
                        isUser=speaker.strip().lower() in ['me', 'you', 'i']
                    ))
                else:  # Standard format
                    speaker, text = match.groups()
                    messages.append(Message(
                        id=f"msg-{message_id}",
                        speaker=speaker.strip(),
                        text=text.strip(),
                        isUser=speaker.strip().lower() in ['me', 'you', 'i']
                    ))
                
                message_id += 1
                total_confidence += conf
                pattern_matches += 1
                matched = True
                break
        
        if not matched and messages:
            # Treat as continuation of last message
            if messages:
                messages[-1].text += "\n" + line
    
    confidence = total_confidence / pattern_matches if pattern_matches > 0 else 0.0
    return messages, confidence

def analyze_sentiment(messages: List[Message]) -> Sentiment:
    """Analyze overall sentiment of the conversation"""
    # Simple rule-based sentiment analysis
    positive_words = ['love', 'great', 'awesome', 'happy', 'good', 'thanks', 'appreciate', 'wonderful', 'amazing', 'perfect']
    negative_words = ['hate', 'terrible', 'awful', 'sad', 'bad', 'angry', 'frustrated', 'disappointed', 'upset', 'horrible']
    
    positive_count = 0
    negative_count = 0
    total_words = 0
    
    for message in messages:
        words = message.text.lower().split()
        total_words += len(words)
        
        for word in words:
            if word in positive_words:
                positive_count += 1
            elif word in negative_words:
                negative_count += 1
    
    if total_words == 0:
        return Sentiment(score=0.0, label="Neutral")
    
    score = (positive_count - negative_count) / max(total_words, 1)
    
    if score > 0.1:
        label = "Positive" if score > 0.3 else "Slightly Positive"
    elif score < -0.1:
        label = "Negative" if score < -0.3 else "Slightly Negative"
    else:
        label = "Neutral"
    
    return Sentiment(score=score, label=label)

def detect_communication_patterns(messages: List[Message]) -> tuple[List[str], List[str], List[str]]:
    """Detect communication patterns, tone, and risks"""
    patterns = []
    tones = []
    risks = []
    
    question_count = 0
    appreciation_count = 0
    defensive_count = 0
    
    for message in messages:
        text = message.text.lower()
        
        # Count questions (bids for connection)
        if '?' in message.text:
            question_count += 1
        
        # Count appreciation
        if any(word in text for word in ['thank', 'appreciate', 'grateful']):
            appreciation_count += 1
        
        # Count defensive language
        if any(phrase in text for phrase in ['but ', 'however', 'actually']):
            defensive_count += 1
    
    # Generate patterns
    if question_count > 0:
        patterns.append(f"{question_count} questions detected - shows curiosity")
    if appreciation_count > 0:
        patterns.append(f"{appreciation_count} expressions of gratitude found")
    
    # Generate tones
    if question_count > len(messages) * 0.3:
        tones.append("Curious")
    if appreciation_count > 0:
        tones.append("Appreciative")
    if defensive_count > 0:
        tones.append("Defensive")
    if not tones:
        tones.append("Conversational")
    
    # Generate risks
    if defensive_count > 0:
        risks.append("Defensive language detected - consider using 'and' instead of 'but'")
    
    return patterns, tones, risks

def analyze_frameworks(messages: List[Message]) -> Frameworks:
    """Analyze using NVC and Gottman frameworks"""
    # Simple analysis - in production, this would be much more sophisticated
    bids = sum(1 for msg in messages if '?' in msg.text or any(word in msg.text.lower() for word in ['how', 'what', 'tell me']))
    
    # Count positive vs negative responses
    turning_toward = sum(1 for msg in messages if any(word in msg.text.lower() for word in ['yes', 'sure', 'sounds good', 'i\'d love']))
    turning_away = sum(1 for msg in messages if msg.text.lower().strip() in ['ok', 'fine', 'maybe'])
    turning_against = sum(1 for msg in messages if any(word in msg.text.lower() for word in ['no', 'can\'t', 'don\'t want']))
    
    # Four Horsemen detection
    criticism = sum(1 for msg in messages if any(phrase in msg.text.lower() for phrase in ['you always', 'you never']))
    defensiveness = sum(1 for msg in messages if any(phrase in msg.text.lower() for phrase in ['that\'s not true', 'i never said']))
    stonewalling = sum(1 for msg in messages if any(phrase in msg.text.lower() for phrase in ['whatever', 'i\'m done']))
    repair_attempts = sum(1 for msg in messages if any(phrase in msg.text.lower() for phrase in ['i\'m sorry', 'let me try again']))
    
    nvc = NVCFramework(
        observation=f"{len(messages)} messages exchanged with {bids} connection attempts",
        feeling="Mixed emotional tone detected" if len(messages) > 3 else "Brief exchange",
        need="Understanding and connection",
        request="Continue building positive communication patterns"
    )
    
    gottman = GottmanFramework(
        bids=bids,
        turning_toward=turning_toward,
        turning_away=turning_away,
        turning_against=turning_against,
        criticism=criticism,
        defensiveness=defensiveness,
        stonewalling=stonewalling,
        repair_attempts=repair_attempts
    )
    
    return Frameworks(nvc=nvc, gottman=gottman)

def generate_highlights(messages: List[Message]) -> List[Highlight]:
    """Generate interactive highlights for the conversation"""
    highlights = []
    highlight_id = 0
    
    for message in messages:
        text = message.text.lower()
        original_text = message.text
        
        # Detect bids for connection (questions)
        if '?' in original_text:
            question_start = original_text.find('?')
            # Find the start of the question
            question_start = max(0, original_text.rfind(' ', 0, question_start) + 1)
            highlights.append(Highlight(
                id=f"highlight-{highlight_id}",
                messageId=message.id,
                startIndex=question_start,
                endIndex=original_text.find('?') + 1,
                type="bid",
                category="Question Bid",
                explanation="This question is a 'bid' for connection - an attempt to engage and learn more.",
                suggestion="Great question! Follow up with active listening to their response.",
                originalText=original_text[question_start:original_text.find('?') + 1]
            ))
            highlight_id += 1
        
        # Detect appreciation
        appreciation_words = ['thank', 'appreciate', 'grateful']
        for word in appreciation_words:
            if word in text:
                start_idx = text.find(word)
                end_idx = start_idx + len(word)
                highlights.append(Highlight(
                    id=f"highlight-{highlight_id}",
                    messageId=message.id,
                    startIndex=start_idx,
                    endIndex=end_idx,
                    type="opportunity",
                    category="Appreciation",
                    explanation="Expressing gratitude strengthens relationships and creates positive connection.",
                    suggestion="Beautiful gratitude! This kind of appreciation strengthens relationships.",
                    originalText=original_text[start_idx:end_idx]
                ))
                highlight_id += 1
                break
        
        # Detect defensive language
        defensive_phrases = ['but ', 'however', 'actually']
        for phrase in defensive_phrases:
            if phrase in text:
                start_idx = text.find(phrase)
                end_idx = start_idx + len(phrase)
                highlights.append(Highlight(
                    id=f"highlight-{highlight_id}",
                    messageId=message.id,
                    startIndex=start_idx,
                    endIndex=end_idx,
                    type="concern",
                    category="Defensive Language",
                    explanation="This language pattern might create distance or defensiveness.",
                    suggestion="Try: 'I hear you, and I also think...' instead of 'but' to sound less dismissive.",
                    originalText=original_text[start_idx:end_idx]
                ))
                highlight_id += 1
                break
    
    return highlights

def generate_suggestions(goal: str, messages: List[Message], analysis: Analysis) -> List[Suggestion]:
    """Generate personalized suggestions based on goal and analysis"""
    suggestions = []
    
    goal_suggestions = {
        'reconnect': [
            Suggestion(
                id=1,
                text="I've been thinking about you and wanted to check in. How have you been feeling lately?",
                style="warm",
                rationale="Shows care and opens space for emotional connection",
                framework="Gottman Method"
            ),
            Suggestion(
                id=2,
                text="I really value our relationship and want to make sure we're good. Can we talk?",
                style="direct",
                rationale="Direct but caring approach that prioritizes the relationship",
                framework="NVC"
            )
        ],
        'clarify': [
            Suggestion(
                id=1,
                text="I want to make sure I understand what you're saying. Can you help me see this from your perspective?",
                style="curious",
                rationale="Shows genuine interest in understanding rather than being right",
                framework="NVC"
            ),
            Suggestion(
                id=2,
                text="I think we might be seeing this differently. Let me share what I heard and you can correct me if I'm off.",
                style="collaborative",
                rationale="Invites collaboration and shows willingness to be wrong",
                framework="Gottman Method"
            )
        ],
        'apologize': [
            Suggestion(
                id=1,
                text="I realize I hurt you with what I said/did, and I'm truly sorry. That wasn't my intention, but I understand the impact.",
                style="accountable",
                rationale="Takes responsibility without making excuses",
                framework="Gottman Repair"
            ),
            Suggestion(
                id=2,
                text="I messed up and I want to make this right. What do you need from me?",
                style="direct",
                rationale="Shows accountability and asks how to repair",
                framework="NVC"
            )
        ],
        'boundary': [
            Suggestion(
                id=1,
                text="I care about our relationship, and I need to share something that's important to me.",
                style="caring",
                rationale="Frames boundary-setting as caring for the relationship",
                framework="NVC"
            )
        ],
        'conflict': [
            Suggestion(
                id=1,
                text="I can see this is really important to you. Help me understand what you need right now.",
                style="validating",
                rationale="Validates their experience and seeks to understand",
                framework="De-escalation"
            )
        ]
    }
    
    # Get goal-specific suggestions
    if goal in goal_suggestions:
        suggestions.extend(goal_suggestions[goal])
    
    # Add pattern-based suggestions
    if analysis.frameworks.gottman.criticism > 0:
        suggestions.append(Suggestion(
            id=len(suggestions) + 1,
            text="I feel [emotion] when [specific behavior happens]. I need [specific need].",
            style="structured",
            rationale="Uses 'I' statements to express concerns without attacking character",
            framework="Gottman Method - Avoiding Criticism"
        ))
    
    return suggestions[:4]  # Limit to 4 suggestions

@app.get("/")
async def root():
    return {"message": "BetterFriend NLP API is running"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_conversation(request: ConversationRequest):
    try:
        # Parse the conversation
        messages, confidence = parse_conversation(request.text)
        
        if not messages:
            raise HTTPException(status_code=400, detail="Could not parse any messages from the conversation")
        
        # Analyze sentiment
        sentiment = analyze_sentiment(messages)
        
        # Detect patterns
        patterns, tones, risks = detect_communication_patterns(messages)
        
        # Analyze frameworks
        frameworks = analyze_frameworks(messages)
        
        # Generate highlights
        interactive_highlights = generate_highlights(messages)
        
        # Create analysis object
        analysis = Analysis(
            sentiment=sentiment,
            tone=tones,
            frameworks=frameworks,
            patterns=patterns,
            risks=risks
        )
        
        # Generate suggestions
        suggestions = generate_suggestions(request.goal, messages, analysis)
        
        # Generate simple highlights for the highlights component
        highlights = []
        for i, msg in enumerate(messages[:3]):  # Limit to first 3 messages
            if '?' in msg.text:
                highlights.append({
                    "id": f"highlight-{i}",
                    "text": msg.text,
                    "speaker": msg.speaker,
                    "type": "opportunity",
                    "category": "Question Bid",
                    "explanation": "This question shows curiosity and interest in connecting."
                })
        
        return AnalysisResponse(
            analysis=analysis,
            suggestions=suggestions,
            highlights=highlights,
            interactiveHighlights=interactive_highlights,
            parsedMessages=messages
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)