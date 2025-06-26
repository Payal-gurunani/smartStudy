import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
         lowercase: true,
         trim: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.matchPassword = async function (enterdPass) {
    return await bcrypt.compare(enterdPass, this.password)
}

export const User = mongoose.model("User", userSchema)