import z from 'zod'
import { CreateMovieDTO } from '../dto/createMovie'
import { UpdateMovieDTO } from '../dto/updateMovie'
// import GenreService from '../services/genre'

const currentYear = new Date().getFullYear()

// Validate genres against database.
// const isValidGenre = async (genres: string[]): Promise<boolean> => {
//   const service = new GenreService()

//   const data = await service.getAll()

//   const validGenres = data.map(({ name }) => name)

//   const invalidGenres = genres.filter(genre => !validGenres.includes(genre))

//   return invalidGenres.length === 0
// }

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
    message: 'Genres must be a non-empty string array of genre names'
  }),
  // genres: z.string().array().nonempty({
  //   message: 'Genres must be a non-empty string array of genres names'
  // }).refine(isValidGenre, { message: 'Invalid genre name' }),
  rate: z.number().min(0).max(10).default(5)
})

export async function validateCreateMovie (object: any): Promise<z.SafeParseReturnType<any, CreateMovieDTO>> {
  return await movieSchema.safeParseAsync(object)
}

export async function validateUpdateMovie (object: any): Promise<z.SafeParseReturnType<any, UpdateMovieDTO>> {
  return await movieSchema.partial().safeParseAsync(object)
}
