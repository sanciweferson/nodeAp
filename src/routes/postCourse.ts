import { FastifyInstance } from "fastify"
import { db } from "../database/client"
import { courses } from "../database/schema"
import { z } from "zod"

const bodySchema = z.object({
  title: z.string().min(5, "Título obrigatório"),
  description: z.string().optional(),
})

const courseResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
})

export async function postCourseRoute(fastify: FastifyInstance) {
  fastify.post(
    "/courses",
    {
      schema: {
        summary: "Cria um novo curso",
        tags: ["Cursos"],
        body: bodySchema,
        response: {
          201: courseResponseSchema,
          400: z.object({ error: z.array(z.any()) }),
        },
      },
    },
    async (request, reply) => {
      const parseBody = bodySchema.safeParse(request.body)
      if (!parseBody.success)
        return reply.code(400).send({ error: parseBody.error.issues })

      const { title, description } = parseBody.data
      const [newCourse] = await db
        .insert(courses)
        .values({ title, description: description || null })
        .returning()

      return reply.code(201).send(newCourse)
    }
  )
}
