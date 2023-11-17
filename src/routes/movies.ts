import { Router } from 'express'
import MovieController from '../controllers/movies'
import { IMovieRepository } from '../types.js'

const createMovieRouter = (repository: IMovieRepository): Router => {
  const moviesRouter = Router()

  const movieController = new MovieController(repository)

  moviesRouter.get('/', movieController.getAll)

  moviesRouter.get('/:id', movieController.getById)

  // moviesRouter.post('/', service.create)

  // moviesRouter.patch('/:id', service.update)

  // moviesRouter.delete('/:id', service.delete)

  return moviesRouter
}

export default createMovieRouter
