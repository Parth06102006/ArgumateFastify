import { sentimentAnalysis, emotionAnalysis } from '../controllers/sentiment.controller.js';

async function sentimentRoutes(fastify, opts) {
  fastify.post('/find/sentiment', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(sentimentAnalysis),
  });

  fastify.post('/find/emotion', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(emotionAnalysis),
  });
}

export default sentimentRoutes;
//6878ae477537cf3f610e5f6b