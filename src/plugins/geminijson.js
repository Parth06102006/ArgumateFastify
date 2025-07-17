import fp from 'fastify-plugin'
import {GoogleGenAI} from '@google/genai'

async function GeminiResponseJsonPlugin(fastify,opts)
{
    fastify.decorate('geminiResponseJson',async(prompt,responseSchema)=>{
        try {
            const client = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY_2});
            const response = await client.models.generateContent({
            model:'gemini-2.5-flash',
            contents:prompt,
            config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
            }})
            return response.text;
        } catch (error) {
            fastify.log.error(`Gemini API Error : ${error}`);
            throw new Error('Failed to Generate Gemini Response')
        }
    })
}

export default fp(GeminiResponseJsonPlugin)