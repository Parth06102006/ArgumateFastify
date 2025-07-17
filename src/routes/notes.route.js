import { notesAnalyzer } from '../controllers/notes.controller.js';

async function notesRoutes(fastify, opts) {
  fastify.get('/create/notes/:id', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(notesAnalyzer),
  });
}

export default notesRoutes;
