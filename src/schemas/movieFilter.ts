import z from 'zod'
import { IMovieFilter } from '../types'

const movieFilterSchema = z.object({
  genre: z.string().optional()
})

export function validateMovieFilter (object: any): z.SafeParseReturnType<any, IMovieFilter> {
  return movieFilterSchema.partial().safeParse(object)
}
