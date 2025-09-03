import Fastify from "fastify"
import cors from "@fastify/cors"
import { registerRoutes } from "./routes"

// ---
// Configuração do Fastify
const fastify = Fastify({ logger: true })

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
})

// Registra as rotas
registerRoutes(fastify)

// ---
// Inicialização do servidor
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
