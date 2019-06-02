import { ILinkedEntity, INeelProcessedTweet, IResource, ITwitterStatus } from '../models/neel-processed-tweet.model';
import { ILocation, LocationSource } from 'app/analysis/twitter-neel/models/location.model';
import { AnalysisState, initAnalysisState } from 'app/analysis/store';

export interface TwitterNeelState extends AnalysisState {
    listeningAnalysisId: string;
    tweets: INeelProcessedTweet[];
    statuses: {
        all: ITwitterStatus[],
        byId: Map<string, ITwitterStatus>,
    };
    entities: {
        all: ILinkedEntity[],
        linked: ILinkedEntity[],
        nil: ILinkedEntity[],
        byLink: Map<string, ILinkedEntity>,
        byStatusId: Map<string, ILinkedEntity[]>,
    };
    resources: {
        all: IResource[],
        byUrl: Map<string, IResource>,
    };
    locations: {
        all: ILocation[],
        bySource: Map<LocationSource, ILocation[]>,
        /*byStatusId: Map<string, ILocation>,
        byResource: Map<string, ILocation>,
        byTwitterUserId: Map<string, ILocation>,*/
    };
}

export const initTwitterNeelState: () => TwitterNeelState = () => {
    return {
        ...initAnalysisState(),
        listeningAnalysisId: null,
        tweets: [],
        statuses: {
            all: [],
            byId: new Map<string, ITwitterStatus>(),
        },
        entities: {
            all: [],
            linked: [],
            nil: [],
            byLink: new Map<string, ILinkedEntity>(),
            byStatusId: new Map<string, ILinkedEntity[]>(),
        },
        resources: {
            all: [],
            byUrl: new Map<string, IResource>(),
        },
        locations: {
            all: [],
            bySource: new Map([
               [LocationSource.Status, []],
               [LocationSource.TwitterUser, []],
               [LocationSource.Resource, []],
            ]),
            /*byStatusId: new Map<string, ILocation>(),
            byResource: new Map<string, ILocation>(),
            byTwitterUserId: new Map<string, ILocation>(),*/
        },
    };
};
