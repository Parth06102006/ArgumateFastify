// routes/speech.routes.js
import {
  createSpeech,
  voiceToText,
  createPoiQues,
  createPoiAns,
  sentimentalAnalysis,
  topicClassifcation,
  getSpeeches,
} from '../controllers/speech.controller.js';

async function speechRoutes(fastify, opts) {
  // Register multer
  fastify.post('/create/speech/:id', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(createSpeech),
  });

  fastify.post('/create/poiQues/:id', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(createPoiQues),
  });

  fastify.post('/create/poiAns/:id', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(createPoiAns),
  });

  fastify.get('/speeches/:id', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(getSpeeches),
  });

  fastify.post('/create/voice', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(voiceToText),
  });

  fastify.post('/create/sentimentalAnalysis', {
    handler: fastify.asyncHandler(sentimentalAnalysis),
  });

  fastify.post('/create/topicClassify/:id', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(topicClassifcation),
  });
}

export default speechRoutes;
