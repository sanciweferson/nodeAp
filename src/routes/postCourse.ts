import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { courses } from "../data"
import { Course, CourseBody } from "../types"
import crypto from "crypto"

export async function postCourseRoute(fastify: FastifyInstance) {
  // Rota POST para criar um novo curso
  fastify.post(
    "/courses",
    {
      schema: {
        body: {
          type: "object",
          required: ["title"],
          properties: { title: { type: "string" } },
        },
        response: {
          200: {
            type: "object",
            properties: { id: { type: "string" }, title: { type: "string" } },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: CourseBody }>,
      reply: FastifyReply
    ) => {
      const newCourse: Course = {
        id: crypto.randomUUID(),
        title: request.body.title,
      }
      courses.push(newCourse)
      return newCourse
    }
  )
}
