import fp from 'fastify-plugin'
import { User } from '../models/user.model.js'

async function authHanlingPlugin(fastify,opts)
{
    fastify.decorate('authHandler',async(request,reply)=>{
        try {
            const decodedToken = await request.jwtVerify({onlyCookie:true})
            if(!decodedToken)
            {
                return reply.notFound('Token not present')
            }
            const user = await User.findById(decodedToken._id).select('-password');
            if(!user)
            {
                return reply.unauthorized('No User Found')
            }
            request.user = user._id;
        } catch (error) {
            return reply.unauthorized('Invalid or missing token');
        }
    })
}

export default fp(authHanlingPlugin)