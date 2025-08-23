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
    sentiment: Dict[str, Any]
    tone: str
    communication_patterns: List[str]
    suggestions: List[str]
    risk_level: str
    emotions: Optional[Dict[str, Any]] = None

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

def determine_tone(sentiment: Dict[str, float], emotions: Dict[str, float]) -> str:
    """Determine overall tone based on sentiment and emotions"""
    if sentiment['positive'] > 0.6:
        return "positive"
    elif sentiment['negative'] > 0.6:
        return "negative"
    elif emotions and emotions.get('anger', 0) > 0.5:
        return "aggressive"
    elif emotions and emotions.get('sadness', 0) > 0.5:
        return "melancholic"
    else:
        return "neutral"

def identify_patterns(text: str, sentiment: Dict[str, float], emotions: Dict[str, float]) -> List[str]:
    """Identify communication patterns"""
    patterns = []
    text_lower = text.lower()
    
    # Check for question patterns
    if '?' in text:
        patterns.append("asking_questions")
    
    # Check for emotional language
    if sentiment['negative'] > 0.5:
        patterns.append("negative_language")
    
    if emotions and emotions.get('anger', 0) > 0.4:
        patterns.append("aggressive_tone")
    
    # Check for empathy indicators
    empathy_words = ['understand', 'feel', 'sorry', 'empathize', 'relate']
    if any(word in text_lower for word in empathy_words):
        patterns.append("empathetic_language")
    
    # Check for defensive language
    defensive_words = ['but', 'however', 'actually', 'well', 'i mean']
    if any(word in text_lower for word in defensive_words):
        patterns.append("defensive_language")
    
    return patterns

def generate_suggestions(patterns: List[str], tone: str, goal: str) -> List[str]:
    """Generate improvement suggestions"""
    suggestions = []
    
    if "negative_language" in patterns:
        suggestions.append("Try to reframe negative statements in a more constructive way")
    
    if "aggressive_tone" in patterns:
        suggestions.append("Consider using softer language to avoid escalating tension")
    
    if "defensive_language" in patterns:
        suggestions.append("Try to listen actively before responding defensively")
    
    if tone == "negative":
        suggestions.append("Consider acknowledging the other person's perspective")
    
    if goal == "conflict_resolution":
        suggestions.append("Focus on finding common ground and shared solutions")
    
    if not suggestions:
        suggestions.append("Your communication style looks good! Keep being authentic.")
    
    return suggestions

def assess_risk_level(sentiment: Dict[str, float], emotions: Dict[str, float], patterns: List[str]) -> str:
    """Assess risk level of the conversation"""
    risk_score = 0
    
    # High negative sentiment increases risk
    if sentiment['negative'] > 0.7:
        risk_score += 2
    
    # Aggressive emotions increase risk
    if emotions and emotions.get('anger', 0) > 0.6:
        risk_score += 2
    
    # Certain patterns increase risk
    high_risk_patterns = ["aggressive_tone", "defensive_language"]
    risk_score += sum(1 for pattern in patterns if pattern in high_risk_patterns)
    
    if risk_score >= 3:
        return "high"
    elif risk_score >= 1:
        return "medium"
    else:
        return "low"

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
        
        # Try Hugging Face analysis first, fall back to rules
        if MODELS_LOADED:
            analysis_result = analyze_with_huggingface(text)
            if analysis_result is None:
                analysis_result = analyze_with_rules(text)
        else:
            analysis_result = analyze_with_rules(text)
        
        sentiment = analysis_result['sentiment']
        emotions = analysis_result.get('emotions', {})
        
        # Determine tone and patterns
        tone = determine_tone(sentiment, emotions)
        patterns = identify_patterns(text, sentiment, emotions)
        suggestions = generate_suggestions(patterns, tone, request.goal)
        risk_level = assess_risk_level(sentiment, emotions, patterns)
        
        return AnalysisResponse(
            sentiment=sentiment,
            tone=tone,
            communication_patterns=patterns,
            suggestions=suggestions,
            risk_level=risk_level,
            emotions=emotions
        )
        
    except Exception as e:
        logger.error(f"Error analyzing conversation: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)