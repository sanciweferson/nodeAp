import Fastify, { FastifyInstance } from "fastify"
import cors from "@fastify/cors"
import dotenv from "dotenv"
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod"
import { fastifySwagger } from "@fastify/swagger"
// import { fastifySwaggerUi } from "@fastify/swagger-ui"
import scalarAPIRefense from'@scalar/fastify-api-reference'

// Import da função que registra todas as rotas
import { registerRoutes } from "./routes/registerRoutes"

dotenv.config()

async function buildServer() {
  const fastify: FastifyInstance = Fastify({ logger: true })

  // --- Zod como type provider
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  // --- CORS
  fastify.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })

if(process.env.NODE_ENV === 'development'){
  // --- Swagger
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "API de Cursos",
        version: "1.0.0",
        description: "API de cursos usando Fastify, Zod e Drizzle ORM",
      },
    },
    transform: jsonSchemaTransform,
  })

  fastify.register(scalarAPIRefense, {
    routePrefix: "/docs",
    configuration: {
      theme: "kepler",
    },
  })
  // await fastify.register(fastifySwaggerUi, {
  //   routePrefix: "/docs",
  //   uiConfig: { docExpansion: "list", deepLinking: false },
  //   staticCSP: true,
  //   initOAuth: {},
  // })
}
  // --- Registrar todas as rotas de uma vez
  await registerRoutes(fastify)

  return fastify
}

const start = async () => {
  const fastify = await buildServer()
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

  try {
    await fastify.listen({ port: PORT })
    console.log(`Servidor rodando em http://localhost:${PORT}`)
    console.log(`Swagger UI em http://localhost:${PORT}/docs`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
