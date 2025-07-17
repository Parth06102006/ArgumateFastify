import { ApiResponse } from "../utils/ApiResponse.js";
import {Debate} from "../models/debate.model.js";
import cuid from 'cuid'
import {fastify} from '../index.js'

const debateCreation = async(request,reply)=>
{   
    const userId = request.user;
    const {topic,format,level,role} = request.body;
    if([topic,format,level,role].some(t=>t?.trim() === ''))
    {
        return reply.badRequest('Enter all the details')
    }
    const cleanedRole = role.replace(/\s*\([^)]*\)/g, '');

    const roles = fastify.roleGenerator(format,cleanedRole);
    console.log(roles)
    try {
        const roomId = cuid()
        const newDebate = await Debate.create({user:userId,topic,format,level,roles,roomId});
        console.log(4)
        if(!newDebate)
        {
            reply.internalServerError('Error Starting a New Debate');
        }
        await newDebate.save();
        
        return reply.code(200).send(new ApiResponse(200,'New Debate Initiated',{debate:newDebate}));

    } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Error Starting a New Debate');
    }
}

const restartDebate = async(request,reply)=>{
    const userId = request.user;
    const {topic} = request.body;
    if(!topic)
    {
        return reply.badRequest('Topic is not present')
    }
    try {
        const existingDebate = await Debate.findOne({user:userId,topic});
        if(!existingDebate)
        {
            return reply.notFound(`Debate with ${topic} not present`)
        }
        
        return reply.code(200).send(new ApiResponse(200,'Debate Restarted',{debate:existingDebate}));

    } catch (error) {
        fastify.log.error(error);
        return reply.internalServerError('Error ReStarting the debate')
    }
}

const getDebateTopics = async (request, reply) => {
    const userId = request.user;

    const existingDebates = await Debate.find({ user: userId });

    if (!existingDebates.length) {
        return reply.notFound(`No Debates Found`)
    };

    return reply.code(200).send({
        success: true,
        message: 'Successfully fetched the debate topics for the user',
        topics:existingDebates,
    });
};

export {debateCreation,restartDebate,getDebateTopics}