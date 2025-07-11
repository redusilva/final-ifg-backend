import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['student', 'teacher'] },
    phone: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: false,
    versionKey: false
});

export const UserModel = model('User', UserSchema);