import mongoose from 'mongoose'

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables')
  }

  try {
    if (!cached.promise) {
      const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
      }

      cached.promise = mongoose.connect(process.env.MONGODB_URI as string, opts)
        .then((mongoose) => {
          return mongoose
        })
    }

    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    throw error
  }
}
