from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
from typing import Dict, Any, List, Optional
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="BetterFriend NLP Backend", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try to load Hugging Face models
try:
    from transformers import pipeline
    
    # Load sentiment analysis model
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="cardiffnlp/twitter-roberta-base-sentiment-latest",
        return_all_scores=True
    )
    
    # Load emotion detection model
    emotion_analyzer = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        return_all_scores=True
    )
    
    logger.info("Successfully loaded Hugging Face models")
    MODELS_LOADED = True
    
except Exception as e:
    logger.warning(f"Failed to load Hugging Face models: {e}")
    logger.info("Falling back to rule-based analysis")
    sentiment_analyzer = None
    emotion_analyzer = None
    MODELS_LOADED = False

class ConversationRequest(BaseModel):
    text: str
    goal: str = "general"

class AnalysisResponse(BaseModel):
    analysis: Dict[str, Any]
    suggestions: List[Dict[str, Any]]
    highlights: List[Dict[str, Any]]
    interactiveHighlights: List[Dict[str, Any]]
    parsedMessages: List[Dict[str, Any]]

def analyze_with_huggingface(text: str) -> Dict[str, Any]:
    """Analyze text using Hugging Face models"""
    try:
        # Truncate text if too long (models have token limits)
        max_length = 500
        if len(text) > max_length:
            text = text[:max_length]
        
        # Sentiment analysis
        sentiment_results = sentiment_analyzer(text)
        sentiment_scores = {result['label'].lower(): result['score'] for result in sentiment_results[0]}
        
        # Map labels to standard format
        sentiment_mapping = {
            'label_0': 'negative',
            'label_1': 'neutral', 
            'label_2': 'positive'
        }
        
        mapped_sentiment = {}
        for key, value in sentiment_scores.items():
            mapped_key = sentiment_mapping.get(key, key)
            mapped_sentiment[mapped_key] = value
        
        # Emotion analysis
        emotion_results = emotion_analyzer(text)
        emotion_scores = {result['label'].lower(): result['score'] for result in emotion_results[0]}
        
        return {
            'sentiment': mapped_sentiment,
            'emotions': emotion_scores
        }
        
    except Exception as e:
        logger.error(f"Error in Hugging Face analysis: {e}")
        return None

def analyze_with_rules(text: str) -> Dict[str, Any]:
    """Fallback rule-based analysis"""
    text_lower = text.lower()
    
    # Simple sentiment analysis
    positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'pleased']
    negative_words = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 'sad', 'upset']
    
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        sentiment = {'positive': 0.7, 'neutral': 0.2, 'negative': 0.1}
    elif negative_count > positive_count:
        sentiment = {'positive': 0.1, 'neutral': 0.2, 'negative': 0.7}
    else:
        sentiment = {'positive': 0.3, 'neutral': 0.4, 'negative': 0.3}
    
    # Simple emotion detection
    emotions = {
        'joy': 0.3 if positive_count > 0 else 0.1,
        'anger': 0.3 if 'angry' in text_lower or 'mad' in text_lower else 0.1,
        'sadness': 0.3 if 'sad' in text_lower or 'disappointed' in text_lower else 0.1,
        'fear': 0.2,
        'surprise': 0.2,
        'disgust': 0.1
    }
    
    return {
        'sentiment': sentiment,
        'emotions': emotions
    }

def parse_conversation(text: str):
    """Simple conversation parser"""
    lines = text.strip().split('\n')
    messages = []
    message_id = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Try to detect speaker patterns
        if ':' in line:
            parts = line.split(':', 1)
            if len(parts) == 2:
                speaker = parts[0].strip()
                message_text = parts[1].strip()
                messages.append({
                    'id': f'msg-{message_id}',
                    'speaker': speaker,
                    'text': message_text,
                    'isUser': speaker.lower() in ['me', 'i', 'you']
                })
                message_id += 1
    
    return messages

def generate_analysis(text: str, goal: str):
    """Generate comprehensive analysis"""
    # Get sentiment and emotion analysis
    if MODELS_LOADED:
        analysis_result = analyze_with_huggingface(text)
        if analysis_result is None:
            analysis_result = analyze_with_rules(text)
    else:
        analysis_result = analyze_with_rules(text)
    
    sentiment = analysis_result['sentiment']
    emotions = analysis_result.get('emotions', {})
    
    # Determine sentiment label
    if sentiment['positive'] > sentiment['negative'] and sentiment['positive'] > sentiment['neutral']:
        sentiment_label = 'Positive'
        sentiment_score = sentiment['positive']
    elif sentiment['negative'] > sentiment['positive'] and sentiment['negative'] > sentiment['neutral']:
        sentiment_label = 'Negative'
        sentiment_score = -sentiment['negative']
    else:
        sentiment_label = 'Neutral'
        sentiment_score = 0
    
    # Generate tone analysis
    tone = []
    if sentiment['positive'] > 0.6:
        tone.append('Positive')
    if sentiment['negative'] > 0.6:
        tone.append('Negative')
    if emotions.get('anger', 0) > 0.4:
        tone.append('Frustrated')
    if emotions.get('joy', 0) > 0.4:
        tone.append('Happy')
    if not tone:
        tone.append('Neutral')
    
    # Generate patterns
    patterns = []
    text_lower = text.lower()
    if '?' in text:
        patterns.append('Asking questions - shows curiosity and engagement')
    if any(word in text_lower for word in ['thank', 'appreciate', 'grateful']):
        patterns.append('Expressing gratitude - builds positive connection')
    if any(word in text_lower for word in ['sorry', 'apologize']):
        patterns.append('Taking responsibility - shows accountability')
    if any(word in text_lower for word in ['feel', 'feeling']):
        patterns.append('Sharing emotions - creates vulnerability and connection')
    
    # Generate risks
    risks = []
    if sentiment['negative'] > 0.7:
        risks.append('High negative sentiment detected - consider taking a break if emotions are running high')
    if any(word in text_lower for word in ['always', 'never']):
        risks.append('Absolute language detected - try using "sometimes" or "often" instead')
    if any(word in text_lower for word in ['but', 'however']):
        risks.append('Defensive language patterns - consider using "and" instead of "but"')
    
    return {
        'sentiment': {
            'score': sentiment_score,
            'label': sentiment_label
        },
        'tone': tone,
        'frameworks': {
            'nvc': {
                'observation': f'Analysis of {len(text.split())} words of conversation',
                'feeling': f'Overall emotional tone appears {sentiment_label.lower()}',
                'need': 'Connection and understanding between participants',
                'request': 'Continue practicing mindful communication'
            },
            'gottman': {
                'bids': 1 if '?' in text else 0,
                'turning_toward': 1 if sentiment['positive'] > 0.5 else 0,
                'turning_away': 1 if sentiment['neutral'] > 0.5 else 0,
                'turning_against': 1 if sentiment['negative'] > 0.5 else 0,
                'criticism': 1 if any(word in text_lower for word in ['always', 'never']) else 0,
                'defensiveness': 1 if any(word in text_lower for word in ['but', 'however']) else 0,
                'stonewalling': 0,
                'repair_attempts': 1 if 'sorry' in text_lower else 0
            }
        },
        'patterns': patterns,
        'risks': risks
    }

def generate_suggestions(goal: str, analysis: dict):
    """Generate contextual suggestions"""
    suggestions = []
    
    goal_suggestions = {
        'reconnect': [
            {
                'id': 1,
                'text': "I've been thinking about you and wanted to check in. How have you been feeling lately?",
                'style': 'warm',
                'rationale': 'Shows care and opens space for emotional connection',
                'framework': 'Gottman Method'
            }
        ],
        'clarify': [
            {
                'id': 1,
                'text': "I want to make sure I understand what you're saying. Can you help me see this from your perspective?",
                'style': 'curious',
                'rationale': 'Shows genuine interest in understanding rather than being right',
                'framework': 'NVC'
            }
        ],
        'apologize': [
            {
                'id': 1,
                'text': "I realize I hurt you with what I said/did, and I'm truly sorry. That wasn't my intention, but I understand the impact.",
                'style': 'accountable',
                'rationale': 'Takes responsibility without making excuses',
                'framework': 'Gottman Repair'
            }
        ]
    }
    
    if goal in goal_suggestions:
        suggestions.extend(goal_suggestions[goal])
    else:
        suggestions.append({
            'id': 1,
            'text': "I want to understand your perspective better. Can you help me see this from your point of view?",
            'style': 'curious',
            'rationale': 'Shows genuine interest in understanding',
            'framework': 'Active Listening'
        })
    
    return suggestions

def generate_highlights(messages: list):
    """Generate conversation highlights"""
    highlights = []
    highlight_id = 0
    
    for message in messages:
        text = message['text'].lower()
        
        # Check for positive patterns
        if any(word in text for word in ['thank', 'appreciate', 'love']):
            highlights.append({
                'id': f'highlight-{highlight_id}',
                'text': message['text'],
                'speaker': message['speaker'],
                'type': 'positive',
                'category': 'Appreciation',
                'explanation': 'Expressing gratitude strengthens relationships and creates positive connection.'
            })
            highlight_id += 1
        
        # Check for questions (bids for connection)
        if '?' in message['text']:
            highlights.append({
                'id': f'highlight-{highlight_id}',
                'text': message['text'],
                'speaker': message['speaker'],
                'type': 'opportunity',
                'category': 'Bid for Connection',
                'explanation': 'Questions are "bids" for connection. Responding positively builds relationship strength.'
            })
            highlight_id += 1
    
    return highlights

def generate_interactive_highlights(messages: list):
    """Generate interactive highlights with positions"""
    highlights = []
    highlight_id = 0
    
    for message in messages:
        text = message['text']
        text_lower = text.lower()
        
        # Find appreciation words
        appreciation_words = ['thank', 'thanks', 'appreciate']
        for word in appreciation_words:
            if word in text_lower:
                start_index = text_lower.find(word)
                highlights.append({
                    'id': f'highlight-{highlight_id}',
                    'messageId': message['id'],
                    'startIndex': start_index,
                    'endIndex': start_index + len(word),
                    'type': 'opportunity',
                    'category': 'Appreciation',
                    'explanation': 'Expressing gratitude strengthens relationships',
                    'suggestion': 'Continue showing appreciation for specific things they do',
                    'originalText': text[start_index:start_index + len(word)]
                })
                highlight_id += 1
                break
    
    return highlights

@app.get("/")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": MODELS_LOADED,
        "message": "BetterFriend NLP Backend is running"
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_conversation(request: ConversationRequest):
    try:
        text = request.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Parse conversation
        messages = parse_conversation(text)
        
        # Generate analysis
        analysis = generate_analysis(text, request.goal)
        
        # Generate suggestions
        suggestions = generate_suggestions(request.goal, analysis)
        
        # Generate highlights
        highlights = generate_highlights(messages)
        interactive_highlights = generate_interactive_highlights(messages)
        
        return AnalysisResponse(
            analysis=analysis,
            suggestions=suggestions,
            highlights=highlights,
            interactiveHighlights=interactive_highlights,
            parsedMessages=messages
        )
        
    except Exception as e:
        logger.error(f"Error analyzing conversation: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)