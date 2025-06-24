import { SessionType } from "../intefaces/config/IntDatabase";
import { ILocation, ILocationCreate } from "../intefaces/entities/Location";
import { ILocationRepository } from "../intefaces/repositories/ILocationRepository";
import { LocationModel } from "../models/LocationMongooseModel";
import { buildLocation } from "../utils/builder";

class LocationMongooseRepository implements ILocationRepository {
    async findLocationByData(data: ILocationCreate, session: SessionType): Promise<ILocation | null> {
        const location = await LocationModel.findOne(data);
        return location ? buildLocation(location) : null;
    }

    async create(data: ILocationCreate, session: SessionType): Promise<ILocation> {
        const location = new LocationModel(data);
        await location.save({ session });

        return buildLocation(location);
    }

    async getAll(session: SessionType): Promise<ILocation[]> {
        const locations = await LocationModel.find().session(session) || [];
        return locations.map(buildLocation);
    }
}

export default LocationMongooseRepository;