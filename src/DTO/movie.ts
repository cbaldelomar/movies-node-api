import Movie from '../data/models/movie'

export class MovieDTO {
  readonly id: string
  readonly title: string
  readonly year: number
  readonly director: string
  readonly duration: number
  readonly poster?: string
  readonly rate?: number
  readonly genres: string[]

  constructor (movie: Movie) {
    this.id = movie.uuid
    this.title = movie.title
    this.year = movie.year
    this.director = movie.director
    this.duration = movie.duration
    this.poster = movie.poster
    this.rate = movie.rate
    this.genres = movie.Genres.map((genre: any) => genre.name)
  }
}
