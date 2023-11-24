import Genre from '../data/models/genre'

export default class GenreService {
  getAll = async (): Promise<Genre[]> => {
    return await Genre.findAll()
  }

  getByName = async (name: string): Promise<Genre | null> => {
    return await Genre.findOne({
      where: {
        name
      }
    })
  }
}
