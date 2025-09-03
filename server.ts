// Importa Fastify e tipos
import Fastify, { FastifyReply, FastifyRequest } from "fastify"
import cors from "@fastify/cors"
import crypto from "crypto"

// ---
// Tipos
interface Course {
  id: string
  title: string
}

interface CourseBody {
  title: string
}

// ---
// Configuração
const fastify = Fastify({ logger: true })

// Registra CORS para permitir requisições do front-end
fastify.register(cors, {
  origin: "*", // para dev, permite qualquer origem
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
})

// Simula banco de dados
const courses: Course[] = [
  { id: "1", title: "Curso de Node.js" },
  { id: "2", title: "Curso de React.js" },
  { id: "3", title: "Curso de Next.js" },
  { id: "4", title: "Curso de JavaScript" },
]

// ---
// Rotas

// Listar todos os cursos
fastify.get("/courses", async () => ({ courses }))

// Listar 1 curso por ID
fastify.get(
  "/courses/:id",
  async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const course = courses.find((c) => c.id === request.params.id)
    if (!course) return reply.code(404).send({ error: "Curso não encontrado" })
    return course
  }
)

// Criar novo curso
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

// Deletar curso
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

// Atualizar curso
fastify.put(
  "/courses/:id",
  async (
    request: FastifyRequest<{ Params: { id: string }; Body: CourseBody }>,
    reply: FastifyReply
  ) => {
    const course = courses.find((c) => c.id === request.params.id)
    if (!course) return reply.code(404).send({ error: "Curso não encontrado" })

    course.title = request.body.title
    return course
  }
)

// ---
// Inicialização
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    console.log("Servidor rodando em http://localhost:3000")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
