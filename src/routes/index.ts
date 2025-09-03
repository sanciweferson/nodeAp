import { FastifyInstance } from "fastify"
import { getCoursesRoute } from "./getCourses"
import { getCourseByIdRoute } from "./getCourseById"
import { postCourseRoute } from "./postCourse"
import { putCourseRoute } from "./putCourse"
import { deleteCourseRoute } from "./deleteCourse"

// Função que registra todas as rotas
export async function registerRoutes(fastify: FastifyInstance) {
  await getCoursesRoute(fastify)
  await getCourseByIdRoute(fastify)
  await postCourseRoute(fastify)
  await putCourseRoute(fastify)
  await deleteCourseRoute(fastify)
}
