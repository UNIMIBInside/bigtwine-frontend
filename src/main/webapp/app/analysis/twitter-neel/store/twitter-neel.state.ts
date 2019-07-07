import { INeelProcessedTweet, INilEntity, IResource } from '../models/neel-processed-tweet.model';
import { ILocation, LocationSource } from 'app/analysis/twitter-neel/models/location.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TwitterNeelState {
    listeningAnalysisId: string;
    pagination: {
        enabled: boolean;
        currentPage: number;
        pageSize: number;
    };
    search: {
        query: any;
        pagination: {
            enabled: boolean;
            currentPage: number;
            pageSize: number;
        };
    };
    tweets: {
        all: INeelProcessedTweet[],
    };
    nilEntities: {
        all: INilEntity[],
        tweetsCount: {[key: string]: number},
    };
    resources: {
        all: IResource[],
        tweetsCount: {[key: string]: number},
        // _flags: {},
    };
    locations: {
        bySource: {[key in LocationSource]: ILocation[]},
        _flags: {},
    };
}

export const initTwitterNeelState: () => TwitterNeelState = () => {
    return {
        listeningAnalysisId: null,
        pagination: {
            enabled: false,
            currentPage: null,
            pageSize: 250,
        },
        search: {
            query: null,
            pagination: {
                enabled: false,
                currentPage: null,
                pageSize: 250,
            }
        },
        tweets: {
            all: [],
        },
        nilEntities: {
            all: [],
            tweetsCount: {},
        },
        resources: {
            all: [],
            tweetsCount: {},
        },
        locations: {
            bySource: {
               [LocationSource.Status]: [],
               [LocationSource.TwitterUser]: [],
               [LocationSource.Resource]: [],
            },
            _flags: {},
        },
    };
};

export const selectTwitterNeelFeature = createFeatureSelector<TwitterNeelState>('twitterNeel');

export const selectListeningAnalysisId = createSelector(
    selectTwitterNeelFeature,
    (state: TwitterNeelState)  => state.listeningAnalysisId
);

export const selectAllTweets = createSelector(
    selectTwitterNeelFeature,
    (state: TwitterNeelState) => state.tweets.all,
);

export const selectResourcesTweetsCount = createSelector(
    selectTwitterNeelFeature,
    (state: TwitterNeelState) => state.resources.tweetsCount,
);

export const selectAllResources = createSelector(
    selectTwitterNeelFeature,
    (state: TwitterNeelState) => state.resources.all,
);

export const selectNilEntitiesTweetsCount = createSelector(
    selectTwitterNeelFeature,
    (state: TwitterNeelState) => state.nilEntities.tweetsCount,
);

export const selectNilEntities = createSelector(
    selectTwitterNeelFeature,
    (state: TwitterNeelState) => state.nilEntities.all,
);

export const selectLocationsBySource = (source: LocationSource) => createSelector(
    selectTwitterNeelFeature,
    (state: TwitterNeelState) => state.locations.bySource[source],
);

export const selectPagination = createSelector(
    selectTwitterNeelFeature,
    (state: TwitterNeelState) => state.pagination,
);

export const selectSearchPagination = createSelector(
    selectTwitterNeelFeature,
    (state: TwitterNeelState) => state.search.pagination,
);

export const selectSearchQuery = createSelector(
    selectTwitterNeelFeature,
    (state: TwitterNeelState) => state.search.query,
);
