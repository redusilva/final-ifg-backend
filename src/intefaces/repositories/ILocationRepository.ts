import { SessionType } from "../config/IntDatabase";
import { ILocationCreate, ILocation } from "../entities/Location";

export interface ILocationRepository {
    findLocationByData: (data: ILocationCreate, session: SessionType) => Promise<ILocation | null>;
    create: (data: ILocationCreate, session: SessionType) => Promise<ILocation>;
    getAll: (session?: SessionType) => Promise<ILocation[]>
}