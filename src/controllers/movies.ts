// import { validateMovie, validatePartialMovie } from '../schemas/movies'
import { RequestHandler } from 'express'
import { validateMovieFilter } from '../schemas/movieFilter'
import MovieService from '../services/movie'
import { MovieDTO } from '../dto/movie'
import { validate as validateUUID } from 'uuid'
import { validateCreateMovie, validateUpdateMovie } from '../schemas/movie'

export default class MovieController {
  private readonly service: MovieService

  constructor (service: MovieService) {
    this.service = service
  }

  getAll = (async (req, res) => {
    const validationResult = validateMovieFilter(req.query)

    if (!validationResult.success) {
      return res.status(400).json(validationResult.error.flatten())
    }

    const filter = validationResult.data

    const movies = await this.service.getAll(filter)

    const moviesDTO = movies.map(movie => new MovieDTO(movie))

    return res.json(moviesDTO)
  }) as RequestHandler

  getById = (async (req, res) => {
    const { id } = req.params

    if (!validateUUID(id)) {
      return res.status(400).json({ message: 'Invalid ID' })
    }

    const movie = await this.service.getById(id)

    if (movie == null) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    const movieDTO = new MovieDTO(movie)

    return res.json(movieDTO)
  }) as RequestHandler

  create = (async (req, res) => {
    const validationResult = await validateCreateMovie(req.body)

    if (!validationResult.success) {
    // return res.status(400).json({ error: JSON.parse(result.error.message) })
      return res.status(400).json(validationResult.error.flatten())
    }

    const movie = await this.service.create(validationResult.data)

    const movieDTO = new MovieDTO(movie)

    return res.status(201).json(movieDTO)
  }) as RequestHandler

  update = (async (req, res) => {
    const { id } = req.params

    if (!validateUUID(id)) {
      return res.status(400).json({ message: 'Invalid ID' })
    }

    const validationResult = await validateUpdateMovie(req.body)

    if (!validationResult.success) {
      return res.status(400).json({ error: JSON.parse(validationResult.error.message) })
    }

    const updatedMovie = await this.service.update(id, validationResult.data)

    if (updatedMovie == null) return res.status(404).json({ message: 'Movie not found' })

    const movieDTO = new MovieDTO(updatedMovie)

    return res.json(movieDTO)
  }) as RequestHandler

  delete = (async (req, res) => {
    const { id } = req.params

    if (!validateUUID(id)) {
      return res.status(400).json({ message: 'Invalid ID' })
    }

    const result = await this.service.delete(id)

    if (result === false) return res.status(404).json({ message: 'Movie not found' })

    return res.json({ message: 'Movie deleted' })
  }) as RequestHandler
}
