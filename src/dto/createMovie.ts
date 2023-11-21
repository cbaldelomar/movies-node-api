export interface CreateMovieDTO {
  title: string
  year: number
  director: string
  duration: number
  poster?: string
  rate?: number
  genres: string[]
}
