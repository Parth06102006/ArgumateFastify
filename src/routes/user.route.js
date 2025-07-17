import {
  signup,
  login,
  logout,
  sendOTP,
  checkSignedUp
} from '../controllers/user.controller.js';

async function userRoutes(fastify, opts) {
  fastify.post('/signup', signup);

  fastify.post('/check/signup', checkSignedUp);

  fastify.post('/login', login);

  fastify.post('/send/otp', sendOTP);

  fastify.post('/logout', {
    preHandler: [fastify.authHandler],
    handler: fastify.asyncHandler(logout)
  });
}

export default userRoutes;