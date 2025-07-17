// routes/speech.routes.js
import {
  createSpeech,
  createPoiQues,
  createPoiAns,
  sentimentalAnalysis,
  topicClassifcation,
  getSpeeches,
} from '../controllers/speech.controller.js';
import { saveMultipartFile } from '../utils/uploadHandler.js';
import { voiceToText } from '../utils/voiceToText.js';

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
    preHandler: fastify.authHandler, // keep your auth middleware
    handler: async function (req, reply) {
      const file = await req.file()

      if (!file) {
        return reply.status(400).send({ error: 'Audio file is required' })
      }

      try {
        const result = await saveMultipartFile(file)
        
        // Pass file path or details to voiceToText logic
        const transcript = await voiceToText(result.path)

        return reply.send({ success: true, transcript })
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ error: 'Upload failed' })
      }
    }
  })


  fastify.post('/create/sentimentalAnalysis', {
    handler: fastify.asyncHandler(sentimentalAnalysis),
  });

  fastify.post('/create/topicClassify/:id', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(topicClassifcation),
  });
}

export default speechRoutes;
