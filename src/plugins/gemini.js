import fp from 'fastify-plugin'
import {GoogleGenAI} from '@google/genai'

async function GeminiResponsePlugin(fastify,opts)
{
    fastify.decorate('geminiResponse',async(prompt)=>{
        try {
            const client = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY_2});
            const response = await client.models.generateContent({
                model:'gemini-2.5-flash',
                contents:prompt
            })
            return response.text;
        } catch (error) {
            fastify.log.error(`Gemini API Error : ${error}`);
            throw new Error('Failed to Generate Gemini Response')
        }
    })
}

export default fp(GeminiResponsePlugin)