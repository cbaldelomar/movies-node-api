// import { validateMovie, validatePartialMovie } from '../schemas/movies'
import { RequestHandler } from 'express'
import { IMovieRepository } from '../types'
import { validateMovieFilter } from '../schemas/movieFilter'

export default class MovieController {
  private readonly repository: IMovieRepository

  constructor (repository: IMovieRepository) {
    this.repository = repository
  }

  getAll = (async (req, res) => {
    const validationResult = validateMovieFilter(req.query)

    if (!validationResult.success) {
      return res.status(400).json(validationResult.error.flatten())
    }

    const filter = validationResult.data

    const movies = await this.repository.getAll(filter)
    // console.log(movies)
    const moviesVM = movies.map((movie) => {
      const genres = movie.Genres.map((genre: any) => genre.name)

      return {
        id: movie.uuid,
        title: movie.title,
        year: movie.year,
        director: movie.director,
        duration: movie.duration,
        poster: movie.poster,
        rate: movie.rate,
        genres
      }
      // return new MovieDTO(movie)
    })
    // console.log(moviesVM)
    return res.json(moviesVM)
  }) as RequestHandler

  getById = (async (req, res) => {
    const { id } = req.params

    const movie = await this.repository.getById(id)

    if (movie == null) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json(movie)
  }) as RequestHandler

  // create = async (req, res) => {
  //   const validationResult = validateMovie(req.body)

  //   if (!validationResult.success) {
  //   // return res.status(400).json({ error: JSON.parse(result.error.message) })
  //     return res.status(400).json(validationResult.error.flatten())
  //   }

  //   const newMovie = await this.movieModel.create({ movie: validationResult.data })

  //   res.status(201).json(newMovie)
  // }

  // update = async (req, res) => {
  //   const validationResult = validatePartialMovie(req.body)

  //   if (!validationResult.success) {
  //     return res.status(400).json({ error: JSON.parse(validationResult.error.message) })
  //   }

  //   const { id } = req.params

  //   const updatedMovie = await this.movieModel.update({ id, movie: validationResult.data })

  //   if (updatedMovie === false) return res.status(404).json({ message: 'Movie not found' })

  //   res.json(updatedMovie)
  // }

  // delete = async (req, res) => {
  //   const { id } = req.params

  //   const result = await this.movieModel.delete({ id })

  //   if (result === false) return res.status(404).json({ message: 'Movie not found' })

  //   res.json({ message: 'Movie deleted' })
  // }
}
