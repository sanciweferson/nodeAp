import { FastifyInstance } from "fastify"
import { courses } from "../data"

export async function getCoursesRoute(fastify: FastifyInstance) {
  // Rota GET para listar todos os cursos
  fastify.get("/courses", async () => ({ courses }))
}
