import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { courses } from "../data"
import { CourseBody } from "../types"

export async function putCourseRoute(fastify: FastifyInstance) {
  // Rota PUT para atualizar um curso por ID
  fastify.put(
    "/courses/:id",
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: CourseBody }>,
      reply: FastifyReply
    ) => {
      const course = courses.find((c) => c.id === request.params.id)
      if (!course)
        return reply.code(404).send({ error: "Curso não encontrado" })
      course.title = request.body.title
      return course
    }
  )
}
