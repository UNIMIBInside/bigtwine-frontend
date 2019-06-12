import { ILinkedEntity, INeelProcessedTweet, IResource, ITwitterStatus } from '../models/neel-processed-tweet.model';
import { ILocation, LocationSource } from 'app/analysis/twitter-neel/models/location.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TwitterNeelState {
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

export const selectTwitterNeelState = createFeatureSelector('twitterNeel');

export const selectAllStatuses = createSelector(
    selectTwitterNeelState,
    (state: TwitterNeelState) => state.statuses.all,
);

export const selectAllResources = createSelector(
    selectTwitterNeelState,
    (state: TwitterNeelState) => state.resources.all,
);

export const selectNilEntities = createSelector(
    selectTwitterNeelState,
    (state: TwitterNeelState) => state.entities.nil,
);

export const selectLinkedEntities = createSelector(
    selectTwitterNeelState,
    (state: TwitterNeelState) => state.entities.linked,
);

export const selectAllLocations = createSelector(
    selectTwitterNeelState,
    (state: TwitterNeelState) => state.locations.all,
);
