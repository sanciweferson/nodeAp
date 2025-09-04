import { FastifyInstance } from "fastify"
import { db } from "../database/client"
import { courses } from "../database/schema"
import { z } from "zod"

// Schema Zod para o array de cursos
const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
})

const coursesResponseSchema = z.object({
  courses: z.array(courseSchema),
})

export async function getCoursesRoute(fastify: FastifyInstance) {
  fastify.get(
    "/courses",
    {
      schema: {
        summary: "Lista todos os cursos",
        description:
          "Essa rota retorna a lista completa de cursos cadastrados.",
        tags: ["Cursos"],
        response: {
       
          200: coursesResponseSchema, // código HTTP e schema
        },
        
      },
    },
    async (_, reply) => {
      const result = await db.select().from(courses)
      return reply.send({ courses: result })
    }
  )
}
