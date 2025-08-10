import { Schema, model, Types } from 'mongoose';

const ScheduleSchema = new Schema({
    day_of_week: {
        type: Number, // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        required: true,
        min: 0,
        max: 6
    },
    start_time: {
        type: String, // formato 'HH:mm'
        required: true
    },
    end_time: {
        type: String, // formato 'HH:mm'
        required: true
    }
}, { _id: false });

const DisciplineSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    total_classes: {
        type: Number,
        required: true
    },
    classroom_id: {
        type: Types.ObjectId,
        ref: 'Classroom',
        required: false
    },
    teacher_id: {
        type: Types.ObjectId,
        ref: 'User',
        required: false
    },
    students: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    schedule: ScheduleSchema,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

DisciplineSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

export const DisciplineModel = model('Discipline', DisciplineSchema);