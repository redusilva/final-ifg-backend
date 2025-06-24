import { SessionType } from "../config/IntDatabase";
import { ILocation, ILocationCreate } from "../entities/Location";
import { BasicServiceResponse } from "../types";

export interface ILocationService {
    create: (data: ILocationCreate, session: SessionType) => Promise<BasicServiceResponse>;
    getAll(session?: SessionType): Promise<ILocation[]>
}