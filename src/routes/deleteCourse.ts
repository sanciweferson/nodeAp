import { FastifyInstance } from "fastify"
import { db } from "../database/client"
import { courses } from "../database/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

const paramsSchema = z.object({
  id: z.string().uuid("ID do curso inválido"),
})

const deleteCourseResponseSchema = z.object({
  message: z.string(),
  course: z.object({
    id: z.string(),
    title: z.string(),
  }),
})

export async function deleteCourseRoute(fastify: FastifyInstance) {
  fastify.delete(
    "/courses/:id",
    {
      schema: {
        summary: "Deleta um curso pelo ID",
        tags: ["Cursos"],
        params: paramsSchema,
        response: {
          200: deleteCourseResponseSchema,
          400: z.object({ error: z.array(z.any()) }),
          404: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const parseParams = paramsSchema.safeParse(request.params)
      if (!parseParams.success)
        return reply.code(400).send({ error: parseParams.error.issues })

      const { id } = parseParams.data
      const [deletedCourse] = await db
        .delete(courses)
        .where(eq(courses.id, id))
        .returning()

      if (!deletedCourse)
        return reply.code(404).send({ error: "Curso não encontrado" })

      return { message: "Curso deletado com sucesso", course: deletedCourse }
    }
  )
}
