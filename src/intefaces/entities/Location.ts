export interface ILocation {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
    min_distance: number;
    created_at: Date;
    updated_at: Date;
}

export interface ILocationCreate {
    name: string;
    latitude: string;
    longitude: string;
    min_distance: number;
}