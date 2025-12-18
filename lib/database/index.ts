import mongoose, { type Mongoose } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

interface MongooseConnection {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

// Use a global variable to maintain connection across hot reloads in development
let cached: MongooseConnection = (global as unknown as { mongoose: MongooseConnection }).mongoose

if (!cached) {
  cached = (global as unknown as { mongoose: MongooseConnection }).mongoose = {
    conn: null,
    promise: null,
  }
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing")

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "evently",
      bufferCommands: false,
    })

  cached.conn = await cached.promise

  return cached.conn
}
