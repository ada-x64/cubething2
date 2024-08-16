// Import the framework and instantiate it
import Fastify from 'fastify'
import Static from '@fastify/static'
import path from 'path'
const fastify = Fastify({
  logger: true
})

fastify.register(Static, {root: path.join(import.meta.dirname, '../../www')})
fastify.register(Static, {root: path.join(import.meta.dirname, '../../dist/client'), prefix: '/js', decorateReply: false})

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}