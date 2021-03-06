import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fp from 'fastify-plugin'
import checkToken, { IPaylaod, ITokenUser, IVerifyToken } from '../services/checkToken'
import connectDB, { IStore } from '../services/connectDB'
import registerJWT from '../services/registerJWT'

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  void await fastify.register(connectDB)
  void await fastify.register(checkToken)
  void await fastify.register(registerJWT)
  void fastify.register(fastifyCors)
  void fastify.register(fastifyMultipart , {
    limits : {
      files :  1,
      fields : 1,
      fileSize : 1000 * 1000
    },
    attachFieldsToBody : true,
  })
  
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    store : IStore,
    auth : IVerifyToken
  }
}

declare module '@fastify/jwt'
{
  export interface FastifyJWT 
  {
    payload : IPaylaod,
    user : ITokenUser
  }
}
