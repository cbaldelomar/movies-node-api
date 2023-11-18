import z from 'zod'
import { MovieFilter } from '../types'

const movieFilterSchema = z.object({
  genre: z.string().optional()
})

export function validateMovieFilter (object: any): z.SafeParseReturnType<any, MovieFilter> {
  return movieFilterSchema.partial().safeParse(object)
}
