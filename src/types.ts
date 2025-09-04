// ---
// Tipos

// Define a estrutura de um objeto 'Course' (Curso) retornado pelo banco.
// 'id' é a chave única do curso (UUID em string)
// 'title' é o título do curso
export interface Course {
  id: string
  title: string
}

// Define a estrutura do corpo da requisição para criar ou atualizar um curso.
// O corpo da requisição deve ter pelo menos a propriedade 'title'.
// 'description' é opcional (pode ser enviada ou não)
export interface CourseBody {
  title: string
  description?: string // o ? indica que é opcional
}



// npm install -D @fastify/swagger
// npm install -D @fastify/swagger-ui
