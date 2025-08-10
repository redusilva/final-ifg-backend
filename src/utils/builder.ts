import { IDiscipline, IDisciplineReport, IDisciplineSummary, Schedule } from "../intefaces/entities/Discipline";
import { IClassroom } from "../intefaces/entities/Classroom";
import { IUser } from "../intefaces/entities/User";
import { BasicServiceResponse } from "../intefaces/types";

export const buildDisciplineItemSummary = (data: any): IDisciplineSummary => {
    return {
        id: data?._id.toString(),
        name: data?.name,
        description: data?.description,
        total_classes: data.total_classes != null ? data.total_classes : null,
        start_time: data?.schedule?.start_time || null,
        end_time: data?.schedule?.end_time || null,
        classroom_name: data?.classroom_id?.name || null,
        teacher_name: data?.teacher_id?.name || null,
    }
}

export const buildDiscipline = (data: any): IDiscipline => {
    return {
        id: data?._id.toString(),
        name: data?.name,
        description: data?.description,
        total_classes: data.total_classes != null ? data.total_classes : null,
        classroom_id: data?.classroom_id?.toString() || null,
        teacher_id: data?.teacher_id?.toString() || null,
        students: data?.students.map((student_id: any) => student_id.toString()) || [],
        schedule: data?.schedule || null,
        created_at: data?.created_at,
        updated_at: data?.updated_at
    }
}

export const buildDisciplineItemReport = (data: any): IDisciplineReport => {
    return {
        id: data?._id.toString(),
        name: data?.name,
        description: data?.description,
        total_classes: data.total_classes != null ? data.total_classes : null,
        classroom: data?.classroom_id || null,
        schedule: data?.schedule || null,
        teacher: buildUser(data?.teacher_id) || null,
        students: data?.students.map((student: any) => buildUser(student)) || [],
        created_at: data?.created_at,
        updated_at: data?.updated_at
    }
}

export const buildUser = (user: any): IUser => ({
    id: user?.id,
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    type: user?.type,
    created_at: user?.created_at,
    updated_at: user?.updated_at
})


export const buildSchedule = (data: any): Schedule => {
    return {
        day_of_week: data?.day_of_week,
        start_time: data?.start_time,
        end_time: data?.end_time
    }
}

export const buildServiceResponse = (status: number, error: string | null, data: any): BasicServiceResponse => {
    return {
        status,
        error,
        data
    };
}

export const buildClassroom = (classroom: any): IClassroom => {
    return {
        id: classroom.id,
        name: classroom.name,
        latitude: classroom.latitude,
        longitude: classroom.longitude,
        min_distance: classroom.min_distance,
        created_at: classroom.created_at,
        updated_at: classroom.updated_at,
    }
}