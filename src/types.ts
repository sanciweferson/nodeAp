// ---
// Tipos
// Define a estrutura de um objeto 'Course' (Curso).
// Ele deve ter um 'id' do tipo string e um 'title' (título) do tipo string.
export interface Course {
  id: string
  title: string
}

// Define a estrutura do corpo da requisição para criar ou atualizar um curso.
// O corpo da requisição deve ter a propriedade 'title' do tipo string.
export interface CourseBody {
  title: string
}
