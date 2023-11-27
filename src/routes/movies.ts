import { Router } from 'express'
import MovieController from '../controllers/movies'
import MovieService from '../services/movie'

const createMovieRouter = (service: MovieService): Router => {
  const moviesRouter = Router()

  const movieController = new MovieController(service)

  moviesRouter.get('/', movieController.getAll)

  moviesRouter.get('/:id', movieController.getById)

  moviesRouter.post('/', movieController.create)

  moviesRouter.patch('/:id', movieController.update)

  // moviesRouter.delete('/:id', service.delete)

  return moviesRouter
}

export default createMovieRouter
