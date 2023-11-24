export interface Server {
  host: string | undefined
  database: string | undefined
  username: string | undefined
  password: string | undefined
  port?: number | undefined
}

// export interface Movie {
//   id: Buffer
//   uuid: string
//   title: string
//   year: number
//   director: string
//   duration: number
//   poster?: string
//   rate?: number
//   createdAt: string
//   genres: Genre[]
// }

// export interface Genre {
//   id: number
//   name: string
// }

export interface MovieFilter {
  genre?: string
}

export type MovieId = Buffer

export interface NewMovieId {
  id: MovieId
}
