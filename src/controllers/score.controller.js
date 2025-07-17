import { ApiResponse } from "../utils/ApiResponse.js";
import {Debate} from "../models/debate.model.js";
import {Speech} from "../models/speech.model.js"
import { Score } from "../models/score.model.js";
import {fastify} from '../index.js'

const scoreCalculate = async(request,reply)=>
    {
        const userId = request.user;
        const debateId = request.params.id;
        const existingDebate = await Debate.findById(debateId);
        if(!existingDebate)
        {
            return reply.notFound('No Existing Debate Found')
        }
        
        let speech = await Speech.findOne({user:userId,debate:debateId});
        if(!speech)
        {
            return reply.notFound('No Existing Speech Found')
        }
        const userSpeeches = speech?.speeches?.filter(t=>t.by === 'user');
        const poiQuestions = speech?.pois?.filter(t=>t.from.by === 'user')
        const poiAnswers = speech?.pois?.filter(t=>t.to.by === 'user' && t.answered)
        const format = existingDebate.format;
        const userRole = existingDebate.roles.find(t=>t.by==='user')
        const role = userRole.role;
        const motion = existingDebate.topic
        const level = existingDebate.level;
        const combinedSpeechContent = `
            Main Speech: "${userSpeeches?.map(s => s.content).join(" ")}"

            POIs Asked:
            ${poiQuestions?.map(q => `- ${q.question}`).join("\n")}

            POIs Answered:
            ${poiAnswers?.map(a => `- ${a.answer}`).join("\n")}
            `;
        const prompt = `
        You are a judge evaluating a ${format} Parliamentary Debate participant based on their overall performance.
        You are acting strictly as a debate judge.

        Evaluate the following user's debate participation based on the motion and content provided.

        Motion: "${motion}"
        Role: ${role}

        Speech Content:
        """
        ${combinedSpeechContent}
        """

        Scoring Format (strictly return JSON only):

        {
        "argumentQuality": number (0–10),
        "rebuttalStrength": number (0–10),
        "engagementWithPOIs": number (0–5),
        "structureAndCohesion": number (0–5),
        "languageAndFluency": number (0–5),
        "roleFulfillment": number (0–5),
        "totalScore": number (out of 40),
        "normalizedScore": number (0–10 from totalScore and normalizing th ratio out of 10 marks),
        "aiFeedback": "Short constructive feedback in 1–2 lines."
        }

        Return ONLY the JSON. No commentary. No prefix. No suffix. No formatting errors.
        `;

        //api call for the score
        const responseSchema = {
            type: "object",
            properties: {
                argumentQuality: { type: "number" },
                rebuttalStrength: { type: "number" },
                engagementWithPOIs: { type: "number" },
                structureAndCohesion: { type: "number" },
                languageAndFluency: { type: "number" },
                roleFulfillment: { type: "number" },
                totalScore: { type: "number" },
                normalizedScore: { type: "number" },
                aiFeedback: { type: "string" }
            },
            required: [
                "argumentQuality",
                "rebuttalStrength",
                "engagementWithPOIs",
                "structureAndCohesion",
                "languageAndFluency",
                "roleFulfillment",
                "totalScore",
                "normalizedScore",
                "aiFeedback"
            ]
            };
        try {
                const jsonData = JSON.parse(await fastify.geminiResponseJson(prompt,responseSchema))
                let score = await Score.findOne({user:userId,debate:debateId})
                if(!score)
                {
                    score = await Score.create({user:userId,debate:debateId,...jsonData})
                }
                else
                {
                    score = await Score.findByIdAndUpdate(score._id,{...jsonData},{new:true})
                } 
            return reply.code(200).send(new ApiResponse(200,'Score Calculated Successfully',{score}))
        } catch (error) {
            return reply.internalServerError('Error Calculating the Score')
        }
    }


export {scoreCalculate}