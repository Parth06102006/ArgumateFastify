import fp from 'fastify-plugin'
import mongoose from 'mongoose'

async function dbConnectionPlugin(fastify,opts)
{
    try {
            await mongoose.connect(process.env.MONGODB_URL)
            fastify.log.info(
                'MongoDB Connected!'
            )
            fastify.decorate('mongoose',mongoose)
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }

}

export default fp(dbConnectionPlugin)