import z from 'zod'
import { movieFilter } from '../types'

const movieFilterSchema = z.object({
  genre: z.string().optional()
})

export function validateMovieFilter (object: any): z.SafeParseReturnType<any, movieFilter> {
  return movieFilterSchema.partial().safeParse(object)
}
