import fp from 'fastify-plugin'

const asyncHandlerPlugin = async (fastify,opts)=>{
    console.log('file is being uploaded')
    fastify.decorate('asyncHandler',(handler)=>{
        return async function (request,reply)
        {
            try {
                await handler(request,reply)
            } catch (error) {
                fastify.log.error(error)
                reply.send(error)
            }
        }
    }
)
}

export default fp(asyncHandlerPlugin)