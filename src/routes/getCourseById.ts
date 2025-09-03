import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { courses } from "../data"

export async function getCourseByIdRoute(fastify: FastifyInstance) {
  // Rota GET para buscar um curso específico por ID
  fastify.get(
    "/courses/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const course = courses.find((c) => c.id === request.params.id)
      if (!course)
        return reply.code(404).send({ error: "Curso não encontrado" })
      return course
    }
  )
}
