import { debateCreation, getDebateTopics, restartDebate } from "../controllers/debate.controller.js";
async function debateRoutes(fastify,opts)
{
    fastify.post('/debate/create',
        {preHandler:[fastify.authHandler]},
        fastify.asyncHandler(debateCreation))
    fastify.post('/debate/restart',
        {preHandler:[fastify.authHandler]},
        fastify.asyncHandler(restartDebate))
    fastify.get('/debate/topics',
        {preHandler:[fastify.authHandler]},
        fastify.asyncHandler(getDebateTopics))
}

export default debateRoutes