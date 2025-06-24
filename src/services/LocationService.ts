import { SessionType } from "../intefaces/config/IntDatabase";
import { ILocationCreate, ILocation } from "../intefaces/entities/Location";
import { ILocationRepository } from "../intefaces/repositories/ILocationRepository";
import { ILocationService } from "../intefaces/services/ILocationService";
import { BasicServiceResponse } from "../intefaces/types";
import { buildServiceResponse } from "../utils/builder";

interface Props {
    locationRepository: ILocationRepository;
}

class LocationService implements ILocationService {
    private locationRepository: ILocationRepository;

    constructor(data: Props) {
        this.locationRepository = data.locationRepository;
    }

    async create(data: ILocationCreate, session: SessionType): Promise<BasicServiceResponse> {
        const currentLocation = await this.locationRepository.findLocationByData(data, session);
        if (currentLocation) {
            return buildServiceResponse(400, "Location already exists", null);
        }

        const location = await this.locationRepository.create(data, session);
        if (!location) {
            return buildServiceResponse(400, "Location not created", null);
        }

        return buildServiceResponse(201, null, location);
    }

    async getAll(session?: SessionType): Promise<ILocation[]> {
        const locations = await this.locationRepository.getAll(session);
        return locations || [];
    }
}

export default LocationService;