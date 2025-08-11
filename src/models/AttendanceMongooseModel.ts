import { Schema, model, Types } from 'mongoose';

const AttendanceSchema = new Schema({
    studentId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    disciplineId: {
        type: Types.ObjectId,
        ref: 'Discipline',
        required: true
    },
    classDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PRESENT', 'ABSENT'],
        default: 'PENDING',
        required: true
    },
    presenceChecks: {
        type: Number,
        default: 0,
        max: 3
    },

    checkTimestamps: {
        type: [Date],
        default: []
    },
    start_time: {
        type: String,
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    versionKey: false
});

AttendanceSchema.index({ studentId: 1, disciplineId: 1, classDate: 1, start_time: 1 }, { unique: true });

export const AttendanceModel = model('Attendance', AttendanceSchema);