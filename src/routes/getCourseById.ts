import { FastifyInstance } from "fastify"
import { db } from "../database/client"
import { courses } from "../database/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

const paramsSchema = z.object({
  id: z.string().uuid("ID do curso inválido"),
})

const courseResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
})

export async function getCourseByIdRoute(fastify: FastifyInstance) {
  fastify.get(
    "/courses/:id",
    {
      schema: {
        summary: "Busca um curso pelo ID",
        description:
          "Essa rota  Busca um curso pelo Id.",
        tags: ["Cursos"],
        params: paramsSchema,
        response: {
          200: courseResponseSchema,
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
      const [course] = await db.select().from(courses).where(eq(courses.id, id))

      if (!course)
        return reply.code(404).send({ error: "Curso não encontrado" })

      return course
    }
  )
}
