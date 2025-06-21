import { IDiscipline, IDisciplineReport, Schedule } from "../intefaces/entities/Discipline";
import { IUser } from "../intefaces/entities/User";

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
        teacher_id: data?.teacher_id?.toString() || null,
        students: data?.students.map((student_id: any) => student_id.toString()) || [],
        schedule: data?.schedule || null,
        created_at: data?.created_at,
        updated_at: data?.updated_at
    }
}

export const buildDisciplineItemRepost = (data: any): IDisciplineReport => {
    return {
        id: data?._id.toString(),
        name: data?.name,
        description: data?.description,
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