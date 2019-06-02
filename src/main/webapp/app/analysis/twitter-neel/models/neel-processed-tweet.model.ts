import { ICoordinates } from 'app/analysis/twitter-neel/models/coordinates.model';

export interface ITextRange {
    start: number;
    end: number;
}

export interface IResource {
    name: string;
    shortDesc: string;
    thumb: string;
    thumbLarge: string;
    url: string;
    coordinates: ICoordinates;
}

export interface ITwitterUser {
    id: string;
    name: string;
    screenName: string;
    location: string;
    profileImageUrl: string;
    coordinates: ICoordinates;
}

export interface ITwitterStatus {
    id: string;
    text: string;
    user: ITwitterUser;
    coordinates: ICoordinates;
}

export interface ILinkedEntity {
    link: string;
    confidence: number;
    category: string;
    isNil: boolean;
    nilCluster: string;
    position: ITextRange;
    resource: IResource;
}

export interface INeelProcessedTweet {
    id: string;
    analysisId: string;
    processDate: Date;
    saveDate: Date;
    status: ITwitterStatus;
    entities: ILinkedEntity[];
}
