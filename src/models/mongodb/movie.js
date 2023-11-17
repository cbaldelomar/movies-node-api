import { MongoClient, ObjectId, ReturnDocument, ServerApiVersion } from 'mongodb'
const uri = 'mongodb+srv://user:password@cluster0.qfdd9hp.mongodb.net/?retryWrites=true&w=majority'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connect () {
  try {
    await client.connect()
    const database = client.db('moviesdb')
    return database.collection('movies')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  } // finally {
  //   // Ensures that the client will close when you finish/error
  //   await client.close()
  // }
}

export class MovieModel {
  static async getAll ({ genre }) {
    const db = await connect()

    if (genre) {
      return db.find({
        genre: {
          $elemMatch: {
            $regex: genre,
            $options: 'i'
          }
        }
      }).toArray()
    }

    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    return db.findOne({ _id: objectId })
  }

  static async create ({ movie }) {
    const db = await connect()

    const { newId } = await db.insertOne(movie)

    return {
      id: newId, // uuid v4
      ...movie
    }
  }

  static async update ({ id, movie }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    const data = await db.findOneAndUpdate(
      { _id: objectId }, { $set: movie }, { returnDocument: ReturnDocument.AFTER }
    )

    if (!data) return false

    return data
  }

  static async delete ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    const { deletedCount } = await db.deleteOne({ _id: objectId })

    return deletedCount > 0
  }
}
