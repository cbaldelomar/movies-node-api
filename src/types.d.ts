export interface Server {
  host: string | undefined
  database: string | undefined
  username: string | undefined
  password: string | undefined
  port?: number | undefined
}

export interface CreateMovieDTO {
  title: string
  year: number
  director: string
  duration: number
  poster?: string
  rate?: number
  genres: string[]
}

export interface UpdateMovieDTO {
  title?: string
  year?: number
  director?: string
  duration?: number
  poster?: string
  rate?: number
  genres?: string[]
}

export type editMovieEntry = Omit<CreateMovieDTO, 'id'>

export interface movieFilter {
  genre?: string
}

export interface IMovieRepository {
  getAll: (filter: movieFilter) => Promise<Movie[]>
  getById: (id: string) => Promise<Movie | null>
}
