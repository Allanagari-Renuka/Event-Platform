import { Schema, model, models, type Document } from "mongoose"

export interface IUser extends Document {
  _id: string
  email: string
  username: string
  firstName: string
  lastName: string
  photo: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, required: true, default: "/diverse-user-avatars.png" },
  },
  { timestamps: true },
)

const User = models.User || model("User", UserSchema)

export default User
