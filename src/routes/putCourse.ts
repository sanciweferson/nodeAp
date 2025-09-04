import { FastifyInstance } from "fastify"
import { db } from "../database/client"
import { courses } from "../database/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

const paramsSchema = z.object({
  id: z.string().uuid("ID do curso inválido"),
})

const bodySchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
})

const courseResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
})

export async function putCourseRoute(fastify: FastifyInstance) {
  fastify.put(
    "/courses/:id",
    {
      schema: {
        summary: "Atualiza um curso pelo ID",
        tags: ["Cursos"],
        params: paramsSchema,
        body: bodySchema,
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
      const parseBody = bodySchema.safeParse(request.body)
      if (!parseBody.success)
        return reply.code(400).send({ error: parseBody.error.issues })

      const { title, description } = parseBody.data
      const [updatedCourse] = await db
        .update(courses)
        .set({ title, description })
        .where(eq(courses.id, id))
        .returning()

      if (!updatedCourse)
        return reply.code(404).send({ error: "Curso não encontrado" })

      return updatedCourse
    }
  )
}
