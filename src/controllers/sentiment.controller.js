import { ApiResponse } from "../utils/ApiResponse.js";
import {fastify} from '../index.js'

const sentimentAnalysis = async(request,reply)=>{
    const {speech} = request.body;
    if(!speech)
    {
        return reply.notFound('No Existing Speech Found')
    }
      const prompt = `
    You are a helpful assistant that classifies emotional tone in a user's text. 
    Given the following input, tell:
    - Overall sentiment (Positive, Negative, or Neutral)
    - Count of clearly positive expressions
    - Count of clearly negative expressions
    Respond in JSON like this:
    {
    "overall": "Positive",
    "positiveCount": 4,
    "negativeCount": 1
    }
    Text: """${speech}"""
    `;
    const sentimentResponseSchema = {
        type: "object",
        properties: {
            overallSentiment: {
            type: "string",
            description: "The overall emotional tone of the text. Should be one of: Positive, Negative, or Neutral."
            },
            positiveCount: {
            type: "number",
            description: "The number of positive emotional indicators or expressions found in the text."
            },
            negativeCount: {
            type: "number",
            description: "The number of negative emotional indicators or expressions found in the text."
            },
            dominantEmotion: {
            type: "string",
            description: "The most prominent specific emotion detected (e.g., joy, sadness, anger, fear, surprise, disgust, trust, etc.)."
            },
            aiEmotionExplanation: {
            type: "string",
            description: "A brief AI-generated explanation of the detected emotions and their possible implications."
            }
        },
        required: [
            "overallSentiment",
            "positiveCount",
            "negativeCount",
            "dominantEmotion",
            "aiEmotionExplanation"
        ]
        };

    try {
/*             const client = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY_2});
            console.log(client)
            const response = await client.models.generateContent({
            model:'gemini-2.5-flash',
            contents:prompt,
            config: {
            responseMimeType: "application/json",
            responseSchema: sentimentResponseSchema
            }}) */
            const json = JSON.parse(await fastify.geminiResponseJson(prompt,sentimentResponseSchema));
        
        return reply.code(200).send(new ApiResponse(200,'SentimentAnalysis : HTML Content Retrieved Successfully',{html:`
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <strong>🧠 Overall Sentiment:</strong> ${json.overallSentiment}<br>
            <strong>✅ Positive Indicators:</strong> ${json.positiveCount}<br>
            <strong>❌ Negative Indicators:</strong> ${json.negativeCount}<br>
            <strong>🎯 Dominant Emotion:</strong> ${json.dominantEmotion}<br>
            <em style="color: #555;">${json.aiEmotionExplanation}</em>
            </div>
        `}))
    } catch (error) {
        return reply.internalServerError('Unable to Generate Sentiment Analysis')
    }
};

const emotionAnalysis =async(request,reply)=>{
    const {speech} = request.body;
    if(!speech)
    {
        return reply.notFound('No Existing Speech Found')
    }
    const prompt = `
        You are an expert language and emotion analyst.

        Given a user's text, analyze it for emotional signals. Identify:
        - Dominant emotion (confidence, urgency, concern, or hope)
        - Confidence level (High / Moderate / Low)
        - Emotional balance (Controlled / Expressive / Overwhelming)
        - A brief explanation

        Return the result strictly in JSON using the following schema:

        {
        "dominantEmotion": "hope",
        "confidenceLevel": "High",
        "emotionalBalance": "Expressive",
        "aiEmotionExplanation": "The speaker expresses optimism and forward-looking language using terms like 'promising' and 'bright'."
        }

        Text: """${speech}"""
    `;


    const emotionResponseSchema = {
        type: "object",
        properties: {
            dominantEmotion: {
            type: "string",
            description: "The most prominent emotion in the text. One of: confidence, urgency, concern, hope."
            },
            confidenceLevel: {
            type: "string",
            description: "High, Moderate, or Low — based on language expressing certainty or belief."
            },
            emotionalBalance: {
            type: "string",
            description: "Categorize the emotional tone as 'Controlled', 'Expressive', or 'Overwhelming'."
            },
            aiEmotionExplanation: {
            type: "string",
            description: "A short explanation of why the dominant emotion was selected and the emotional state inferred."
            }
        },
        required: [
            "dominantEmotion",
            "confidenceLevel",
            "emotionalBalance",
            "aiEmotionExplanation"
        ]
        };



    try {
        const json = JSON.parse(await fastify.geminiResponseJson(prompt,emotionResponseSchema));
        
        return reply.code(200).send(new ApiResponse(200,'EmotionalAnalysis : HTML Content Retrieved Successfully',{html:`
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <strong>Dominant Emotion:</strong> ${json.dominantEmotion}<br>
            <strong>Confidence Level:</strong> ${json.confidenceLevel}<br>
            <strong>Emotional Balance:</strong> ${json.emotionalBalance}
            <em>${json.aiEmotionExplanation}</em>
            </div>
        `}))
    } catch (error) {
        return reply.internalServerError('Unable to Generate Emotional Analysis')
    }
};

export {sentimentAnalysis,emotionAnalysis}