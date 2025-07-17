import dotenv from 'dotenv'
import Fastify from 'fastify';

dotenv.config({
    path:'./.env'
})

const fastify = Fastify({logger:true})

async function initialize() {
  // Register CORS with dynamic import
fastify.register((await import('@fastify/cors')).default, {
  origin: (origin, cb) => {
    if (!origin) {
      // Allow requests with no origin (e.g., curl, Postman, mobile apps)
      return cb(null, true);
    }

    try {
      const hostname = new URL(origin).hostname;
      if (hostname === process.env.FRONTEND_URL) {
        cb(null, {
          origin: true,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          allowedHeaders: ['Content-Type', 'Authorization'],
        });
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    } catch (err) {
      cb(new Error('Invalid origin'), false);
    }
  }
});


  // Register other core plugins
  fastify.register((await import('@fastify/sensible')).default)
  fastify.register((await import('@fastify/cookie')).default, {
    secret: process.env.COOKIE_SECRET,
  })

  fastify.register((await import('@fastify/jwt')), {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: 'token',
    },
    sign: {
      expiresIn: process.env.TOKEN_EXPIRY
    }
  })

  // Register custom plugins
  fastify.register((await import('./plugins/mongodb.js')).default)
  fastify.register(await import('./plugins/asyncHandler.js'))
  fastify.register(await import('./plugins/auth.js'))
  fastify.register((await import('./plugins/otp.js')).default)
  fastify.register((await import('./plugins/roleGenerator.js')).default)
  fastify.register((await import('./plugins/gemini.js')).default)
  fastify.register((await import('./plugins/geminijson.js')).default)
  
  // Register routes
  fastify.register((await import('./routes/user.route.js')).default, { prefix: '/api/v1' })
  fastify.register((await import('./routes/debate.route.js')).default, { prefix: '/api/v1' })
  fastify.register((await import('./routes/speech.route.js')).default, { prefix: '/api/v1' })
  fastify.register((await import('./routes/notes.route.js')).default, { prefix: '/api/v1' })

  fastify.register((await import('./routes/sentiment.route.js')).default, { prefix: '/api/v1' })

  fastify.register((await import('./routes/score.route.js')).default, { prefix: '/api/v1' })
  
}

fastify.get('/', async (request, reply) => {
  return { status: 'OK', message: 'Server running successfully' };
});


const start = async ()=>{
    try {
        await initialize()
        .then(()=>{
            console.log('shiru')
            fastify.ready()})
        .then(()=>fastify.listen({port:process.env.PORT}).then(
            fastify.log.info(
                `Server is running on the port: http://localhost:${process.env.PORT}`
            )
        ))
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}
export {fastify}
start()