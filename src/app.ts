import dotenv from 'dotenv'
import express from 'express'
import { corsMiddleware } from './middlewares/cors'
import createMovieRouter from './routes/movies'
import configDatabase from './data/database'
import MovieRepository from './data/repositories/movie'

dotenv.config()

const app = express()

app.disable('x-powered-by')

app.use(corsMiddleware())

// Usar middleware que obtiene el json en el body de la request.
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: 'Hello world' })
})

const server = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  // port: 3306, default port
  password: process.env.DB_PASSWORD
}

configDatabase(server)

const movieRouter = createMovieRouter(MovieRepository)

app.use('/movies', movieRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
