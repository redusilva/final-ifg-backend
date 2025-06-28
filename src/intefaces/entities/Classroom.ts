export interface IClassroom {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
    min_distance: number;
    created_at: Date;
    updated_at: Date;
}

export interface IClassroomCreate {
    name: string;
    latitude: string;
    longitude: string;
    min_distance: number;
}