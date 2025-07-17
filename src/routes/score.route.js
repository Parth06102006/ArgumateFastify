import { scoreCalculate } from '../controllers/score.controller.js';

async function scoreRoutes(fastify, opts) {
  fastify.get('/totalScore/:id', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(scoreCalculate),
  });
}

export default scoreRoutes;
