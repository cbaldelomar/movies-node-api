import Movie from './data/models/movie'
import { ErrorTypes } from './enums'

export interface IServer {
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

export interface IMovieFilter {
  genre?: string
}

export type MovieId = Buffer

export interface INewMovieId {
  id: MovieId
}

export interface IMovieService {
  getAll: (filter: IMovieFilter) => Promise<Movie[]>
  getById: (id: string) => Promise<Result<Movie>>
  create: (movieDTO: ICreateMovieRequest) => Promise<Result<Movie>>
  update: (id: string, movie: IUpdateMovieRequest) => Promise<Result<Movie>>
  delete: (id: string) => Promise<Result<Movie>>
}

export interface ICreateMovieRequest {
  title: string
  year: number
  director: string
  duration: number
  poster?: string
  rate?: number
  genres: string[]
}

export interface IUpdateMovieRequest {
  title?: string
  year?: number
  director?: string
  duration?: number
  poster?: string
  rate?: number
  genres?: string[]
}

export type ResultErrorType = ErrorTypes.NOT_FOUND | ErrorTypes.AUTHORIZATION

export type ResultValidationErrorType = ErrorTypes.VALIDATION

export interface IResultSuccess<T> {
  success: true
  data: T
}

export interface IResultError {
  success: false
  errorType: ResultErrorType
  message: string
}

export interface IResultValidationError extends Omit<IResultError, 'message'> {
  errorType: ResultValidationErrorType
  errors: IValidationError[]
}

export interface IValidationError {
  field: string
  message: string
}

export type ResultFailure = IResultError | IResultValidationError

export type Result<T> = IResultSuccess<T> | ResultFailure

export interface IErrorResponse {
  error: string
}

export interface IValidationErrorResponse<T = any> {
  errors: string[]
  fields: {
    [K in keyof T]?: string[]
  }
}
