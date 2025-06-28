import { Schema, model } from 'mongoose';

const ClassroomSchema = new Schema(
    {
        name: { type: String, required: true },
        latitude: { type: String, required: true },
        longitude: { type: String, required: true },
        min_distance: { type: Number, required: true },
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

// Middleware para atualizar automaticamente updated_at
ClassroomSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

export const ClassroomModel = model('Classroom', ClassroomSchema);
