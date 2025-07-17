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

    
   fastify.addHook('preHandler',fastify.authHandler)
  // Register multer
  fastify.post('/create/speech/:id', {
    handler: fastify.asyncHandler(createSpeech),
  });

  fastify.post('/create/poiQues/:id', {
    handler: fastify.asyncHandler(createPoiQues),
  });

  fastify.post('/create/poiAns/:id', {
    handler: fastify.asyncHandler(createPoiAns),
  });

  fastify.get('/speeches/:id', {
    handler: fastify.asyncHandler(getSpeeches),
  });

  fastify.post('/create/voice', {
    handler: fastify.asyncHandler(voiceToText),
  });

  fastify.post('/create/sentimentalAnalysis', {
    handler: fastify.asyncHandler(sentimentalAnalysis),
  });

  fastify.post('/create/topicClassify/:id', {
    handler: fastify.asyncHandler(topicClassifcation),
  });
}

export default speechRoutes;
