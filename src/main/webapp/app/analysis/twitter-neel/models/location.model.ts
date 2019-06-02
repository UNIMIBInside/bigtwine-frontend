import { ICoordinates } from 'app/analysis/twitter-neel/models/coordinates.model';

export enum LocationSource {
    TwitterUser, Resource, Status
}

export interface ILocation {
    coordinates: ICoordinates;
    source: LocationSource;
    ref: string;
}

export class Location implements ILocation {
    constructor(
        public coordinates: ICoordinates,
        public source: LocationSource,
        public ref: string) {}
}
