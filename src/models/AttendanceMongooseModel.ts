import { Schema, model, Types } from 'mongoose';

const AttendanceSchema = new Schema({
    studentId: {
        type: Types.ObjectId,
        ref: 'User',
        required: false
    },
    teacherId: {
        type: Types.ObjectId,
        ref: 'User',
        required: false
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

AttendanceSchema.index({ studentId: 1, disciplineId: 1, classDate: 1, start_time: 1 }, { unique: true, partialFilterExpression: { studentId: { $exists: true } } });
AttendanceSchema.index({ teacherId: 1, disciplineId: 1, classDate: 1, start_time: 1 }, { unique: true, partialFilterExpression: { teacherId: { $exists: true } } });


AttendanceSchema.pre('validate', function (next) {
    if (!this.studentId && !this.teacherId) {
        next(new Error('Attendance record must have either a studentId or a teacherId.'));
    } else {
        next();
    }
});

export const AttendanceModel = model('Attendance', AttendanceSchema);