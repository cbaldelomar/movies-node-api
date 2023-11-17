import cors from 'cors'
import { RequestHandler } from 'express'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'https://movies.com'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}): RequestHandler => cors({
  origin: (origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => {
    if (origin == null || acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
