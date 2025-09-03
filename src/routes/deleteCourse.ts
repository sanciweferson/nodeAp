import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { courses } from "../data"

export async function deleteCourseRoute(fastify: FastifyInstance) {
  // Rota DELETE para remover um curso por ID
  fastify.delete(
    "/courses/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const index = courses.findIndex((c) => c.id === request.params.id)
      if (index === -1)
        return reply.code(404).send({ error: "Curso não encontrado" })
      const deleted = courses.splice(index, 1)[0]
      return { message: "Curso deletado com sucesso", course: deleted }
    }
  )
}
