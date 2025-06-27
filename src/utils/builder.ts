import { IDiscipline, IDisciplineReport, Schedule } from "../intefaces/entities/Discipline";
import { ILocation } from "../intefaces/entities/Location";
import { IUser } from "../intefaces/entities/User";
import { BasicServiceResponse } from "../intefaces/types";

export const buildUser = (user: any): IUser => ({
    id: user?.id,
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    type: user?.type,
    created_at: user?.created_at,
    updated_at: user?.updated_at
})

export const buildDiscipline = (data: any): IDiscipline => {
    return {
        id: data?._id.toString(),
        name: data?.name,
        description: data?.description,
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
        classroom: data?.classroom_id || null,
        schedule: data?.schedule || null,
        teacher: buildUser(data?.teacher_id) || null,
        students: data?.students.map((student: any) => buildUser(student)) || [],
        created_at: data?.created_at,
        updated_at: data?.updated_at
    }
}

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

export const buildLocation = (location: any): ILocation => {
    return {
        id: location.id,
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        min_distance: location.min_distance,
        created_at: location.created_at,
        updated_at: location.updated_at,
    }
}