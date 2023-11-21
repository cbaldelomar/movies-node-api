import z from 'zod'
import { CreateMovieDTO } from '../dto/createMovie'
import { UpdateMovieDTO } from '../dto/updateMovie'

const currentYear = new Date().getFullYear()

const movieSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string'
  }),
  year: z.number().int().min(1900).max(currentYear,
    { message: `Year must be between 1900 and the current year (${currentYear})` }),
  director: z.string(),
  duration: z.number().positive({ message: 'Duration must be greater than 0' }),
  poster: z.string().url({ message: 'Poster must be a valid URL' }).optional(),
  genres: z.string().array().nonempty({
    message: 'Genre must be a non-empty array of strings'
  }),
  rate: z.number().min(0).max(10).default(5)
})

export function validateCreateMovie (object: any): z.SafeParseReturnType<any, CreateMovieDTO> {
  return movieSchema.safeParse(object)
}

export function validateUpdateMovie (object: any): z.SafeParseReturnType<any, UpdateMovieDTO> {
  return movieSchema.partial().safeParse(object)
}
