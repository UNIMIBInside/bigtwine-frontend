import { ILinkedEntity, INeelProcessedTweet, IResource, ITwitterStatus } from '../models/neel-processed-tweet.model';
import { ILocation, LocationSource } from 'app/analysis/twitter-neel/models/location.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TwitterNeelState {
    listeningAnalysisId: string;
    tweets: INeelProcessedTweet[];
    statuses: {
        all: ITwitterStatus[],
        byId: {[key: string]: ITwitterStatus},
    };
    entities: {
        all: ILinkedEntity[],
        linked: ILinkedEntity[],
        nil: ILinkedEntity[],
        byLink: {[key: string]: ILinkedEntity},
        byStatusId: {[key: string]: ILinkedEntity},
    };
    resources: {
        all: IResource[],
        byUrl: {[key: string]: IResource},
    };
    locations: {
        all: ILocation[],
        bySource: {[key in LocationSource]: ILocation[]},
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
            byId: {},
        },
        entities: {
            all: [],
            linked: [],
            nil: [],
            byLink: {},
            byStatusId: {},
        },
        resources: {
            all: [],
            byUrl: {},
        },
        locations: {
            all: [],
            bySource: {
               [LocationSource.Status]: [],
               [LocationSource.TwitterUser]: [],
               [LocationSource.Resource]: [],
            },
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

export const selectLocationsBySource = createSelector(
    selectTwitterNeelState,
    (state: TwitterNeelState) => state.locations.bySource,
    (locations: Map<LocationSource, ILocation[]>, props: any) => locations.get(props.source)
);
