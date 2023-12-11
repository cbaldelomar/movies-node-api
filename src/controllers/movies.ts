import { RequestHandler } from 'express'
import { validateMovieFilter } from '../schemas/movieFilter'
import { MovieResponse } from '../responses/movie'
import { validateCreateMovie, validateUpdateMovie } from '../schemas/movie'
import { IMovieService } from '../types'
import { ErrorResponse } from '../responses/error'

export default class MovieController {
  private readonly service: IMovieService

  constructor (service: IMovieService) {
    this.service = service
  }

  getAll = (async (req, res) => {
    const validationResult = validateMovieFilter(req.query)

    if (!validationResult.success) {
      const errorResponse = new ErrorResponse(validationResult.error)

      return res.status(400).json(errorResponse.body)

      // return res.status(400).json(validationResult.error.flatten())
    }

    const filter = validationResult.data

    const movies = await this.service.getAll(filter)

    const movieResponses = movies.map(movie => new MovieResponse(movie))

    return res.json(movieResponses)
  }) as RequestHandler

  getById = (async (req, res) => {
    const { id } = req.params

    const result = await this.service.getById(id)

    if (!result.success) {
      const errorResponse = new ErrorResponse(result)

      return res.status(errorResponse.status).json(errorResponse.body)
    }

    const movieResponse = new MovieResponse(result.data)

    return res.json(movieResponse)
  }) as RequestHandler

  create = (async (req, res) => {
    const validationResult = await validateCreateMovie(req.body)

    if (!validationResult.success) {
      const errorResponse = new ErrorResponse(validationResult.error)

      return res.status(errorResponse.status).json(errorResponse.body)

      // return res.status(400).json(validationResult.error.flatten())
      // return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const result = await this.service.create(validationResult.data)

    if (!result.success) {
      const errorResponse = new ErrorResponse(result)

      return res.status(errorResponse.status).json(errorResponse.body)
    }

    const movieResponse = new MovieResponse(result.data)

    return res.status(201).json(movieResponse)
  }) as RequestHandler

  update = (async (req, res) => {
    const { id } = req.params

    const validationResult = await validateUpdateMovie(req.body)

    if (!validationResult.success) {
      const errorResponse = new ErrorResponse(validationResult.error)

      return res.status(errorResponse.status).json(errorResponse.body)

      // return res.status(400).json(validationResult.error.flatten())
      // return res.status(400).json({ error: JSON.parse(validationResult.error.message) })
    }

    const result = await this.service.update(id, validationResult.data)

    if (!result.success) {
      const errorResponse = new ErrorResponse(result)

      return res.status(errorResponse.status).json(errorResponse.body)
    }

    const movieResponse = new MovieResponse(result.data)

    return res.json(movieResponse)
  }) as RequestHandler

  delete = (async (req, res) => {
    const { id } = req.params

    const result = await this.service.delete(id)

    if (!result.success) {
      const errorResponse = new ErrorResponse(result)

      return res.status(errorResponse.status).json(errorResponse.body)
    }

    return res.status(204).json()
  }) as RequestHandler
}
