import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENKIT_API_KEY || "")

interface EmotionAnalysis {
  primary: string
  confidence: number
  emotions: Record<string, number>
}

interface WellnessSuggestion {
  suggestion: string
  category: string
}

function analyzeEmotion(text: string): EmotionAnalysis {
  console.log("[v0] Analyzing emotion in text:", text)

  const emotionKeywords: Record<string, string[]> = {
    happy: ["happy", "great", "wonderful", "excellent", "joy", "excited", "amazing"],
    sad: ["sad", "depressed", "down", "hopeless", "lonely", "miserable", "terrible"],
    anxious: ["anxious", "worried", "nervous", "stressed", "scared", "panic", "fear"],
    calm: ["calm", "peaceful", "relaxed", "serene", "zen", "content", "okay"],
    angry: ["angry", "furious", "mad", "annoyed", "irritated", "frustrated", "rage"],
    neutral: ["fine", "okay", "alright", "normal", "regular", "usual"],
  }

  const emotionScores: Record<string, number> = {}
  const lowerText = text.toLowerCase()

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const matches = keywords.filter((kw) => lowerText.includes(kw)).length
    emotionScores[emotion] = matches
  }

  const maxScore = Math.max(...Object.values(emotionScores))
  const primaryEmotion =
    maxScore > 0 ? Object.entries(emotionScores).find(([, score]) => score === maxScore)?.[0] || "neutral" : "neutral"

  const confidence = maxScore > 0 ? Math.min(0.9, maxScore / 3) : 0.5

  console.log("[v0] Emotion detected:", primaryEmotion, "Confidence:", confidence)

  return {
    primary: primaryEmotion,
    confidence,
    emotions: emotionScores,
  }
}

function getWellnessSuggestions(emotion: string): string[] {
  const suggestionsByEmotion: Record<string, string[]> = {
    happy: [
      "Keep this positive momentum by journaling about what made you happy",
      "Share your joy with someone close to you",
      "Practice gratitude meditation to solidify this feeling",
    ],
    sad: [
      "Try a 5-minute breathing exercise to regulate your mood",
      "Go for a short walk in nature or get some sunlight",
      "Write in your journal about what's troubling you",
      "Consider reaching out to someone you trust",
    ],
    anxious: [
      "Practice the 4-7-8 breathing technique right now",
      "Try grounding exercises (5 senses technique)",
      "A guided meditation could help calm your mind",
      "Take a short break and move your body",
    ],
    calm: [
      "Maintain this peace with mindfulness meditation",
      "This is a great time for reflective journaling",
      "Consider helping someone else - it spreads positivity",
    ],
    angry: [
      "Try deep breathing or a cold water face wash",
      "Physical activity like exercise can help release tension",
      "Write about your feelings without filtering",
      "Give yourself permission to feel angry, then let it go",
    ],
    neutral: [
      "Explore what might be affecting your mood",
      "Try a mindfulness exercise to increase self-awareness",
      "Journaling can help uncover deeper feelings",
    ],
  }

  return (suggestionsByEmotion[emotion.toLowerCase()] || suggestionsByEmotion.neutral).slice(0, 3)
}

async function generateAIResponse(
  userMessage: string,
  emotion: string,
  previousMessages: Array<{ role: string; content: string }>,
): Promise<string> {
  console.log("[v0] Generating AI response for emotion:", emotion)

  const systemPrompt = `You are Mindwell, a compassionate AI mental wellness companion. 
Your role is to:
- Listen empathetically to users' emotions and concerns
- Provide supportive, non-judgmental responses
- Suggest helpful wellness techniques when appropriate
- Ask thoughtful follow-up questions to help users explore their feelings
- Remember that you're not a replacement for professional mental health care

The user is currently experiencing: ${emotion}

Keep responses concise (1-2 sentences) and warm. Focus on understanding first, then gently guide toward wellness.`

  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const chat = model.startChat({
    history: previousMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })),
  })

  try {
    const result = await chat.sendMessage(userMessage)
    const response = result.response.text()
    console.log("[v0] AI Response:", response)
    return response
  } catch (error) {
    console.error("[v0] Genkit error:", error)
    return "I'm here to listen. Can you tell me more about how you're feeling?"
  }
}

export async function POST(req: Request) {
  try {
    console.log("[v0] Chat API called")

    const { userMessage, messages } = await req.json()

    if (!userMessage) {
      return Response.json({ error: "No message provided" }, { status: 400 })
    }

    // Analyze emotion
    const emotionData = analyzeEmotion(userMessage)
    console.log("[v0] Emotion analysis:", emotionData)

    // Get wellness suggestions
    const suggestions = getWellnessSuggestions(emotionData.primary)
    console.log("[v0] Suggestions:", suggestions)

    // Generate AI response
    const response = await generateAIResponse(userMessage, emotionData.primary, messages)

    return Response.json({
      response,
      emotion: {
        primary: emotionData.primary,
        confidence: emotionData.confidence,
      },
      suggestions,
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return Response.json({ error: "Failed to process message" }, { status: 500 })
  }
}
