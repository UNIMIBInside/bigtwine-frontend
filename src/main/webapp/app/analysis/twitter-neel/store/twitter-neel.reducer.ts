import { initTwitterNeelState, TwitterNeelState } from './twitter-neel.state';
import * as TwitterNeelActions from './twitter-neel.action';
import { ActionTypes } from './twitter-neel.action';
import { ILocation, Location, LocationSource } from 'app/analysis/twitter-neel/models/location.model';
import { ILinkedEntity, INilEntity, IResource } from 'app/analysis/twitter-neel/models/neel-processed-tweet.model';

export const initialState: TwitterNeelState = initTwitterNeelState();

const removeLocationDuplicates = (location: ILocation, index: number, self: ILocation[]) =>
        index === self.findIndex(l => l.ref === location.ref);

const removeResourceDuplicates = (resource: IResource, index: number, self: IResource[]) =>
    index === self.findIndex(r => r.url === resource.url);

const updateLocationsFlags = (initialFlags, newLocations: ILocation[]) => {
    return newLocations.reduce((flags, l) => {
            flags[l.source + l.ref] = true;
            return flags;
        },
        {...initialFlags});
};

const updateResourcesTweetsCount = (initialCounters: {[key: string]: number}, entities: ILinkedEntity[]) => {
    return entities.reduce((counters, e) => {
        if (!counters[e.resource.url]) {
            counters[e.resource.url] = 0;
        }

        counters[e.resource.url]++;

        return counters;
        },
        {...initialCounters});
};

export const buildNilEntityIdentifier = (entity: INilEntity) => `${entity.value}//${entity.nilCluster}`;

const updateNilEntitiesTweetsCount = (initialCounters: {[key: string]: number}, entities: INilEntity[]) => {
    return entities.reduce((counters, e) => {
        const nilId = buildNilEntityIdentifier(e);
        if (!counters[nilId]) {
            counters[nilId] = 0;
        }

        counters[nilId]++;

        return counters;
        },
        {...initialCounters});
};

const nilEntityComparator = (counters: {[key: string]: number}, a: INilEntity, b: INilEntity): number => {
    const aCount = counters[buildNilEntityIdentifier(a)] || 0;
    const bCount = counters[buildNilEntityIdentifier(b)] || 0;

    return bCount - aCount;
};

const resourceComparator = (counters: {[key: string]: number}, a: IResource, b: IResource): number => {
    const aCount = counters[a.url] || 0;
    const bCount = counters[b.url] || 0;

    return bCount - aCount;
};

export function TwitterNeelReducer(state = initialState, action: TwitterNeelActions.All): TwitterNeelState {
    switch (action.type) {
        case TwitterNeelActions.ActionTypes.StartListenTwitterNeelResults:
            return {...state, listeningAnalysisId: (action as TwitterNeelActions.StartListenTwitterNeelResults).analysisId};
        case TwitterNeelActions.ActionTypes.StopListenTwitterNeelResults:
            return {...state, listeningAnalysisId: null};
        case TwitterNeelActions.ActionTypes.TwitterNeelResultsReceived:
            if (state.listeningAnalysisId === null) {
                return state;
            }

            const tweets = (action as TwitterNeelActions.TwitterNeelResultsReceived).results
                .filter(t => t.analysisId === state.listeningAnalysisId);

            const entities = tweets
                .filter(t => t.entities && t.entities.length)
                .reduce((a, t) => a.concat(t.entities), []) as ILinkedEntity[];
            const linkedEntities = entities.filter(e => !e.isNil);
            const nilEntities = entities
                .filter(e => e.isNil)
                .map(e => ({value: e.value, nilCluster: e.nilCluster}));
            const resources = linkedEntities
                .map(e => e.resource)
                .filter(removeResourceDuplicates);

            const statuses = tweets.map(t => t.status);
            const statusesLocations = statuses
                .filter(t => t.coordinates)
                .map(t => new Location(t.coordinates, LocationSource.Status, t.id))
                .filter(removeLocationDuplicates);
            const usersLocations = statuses
                .filter(t => t.user && t.user.coordinates)
                .map(t => new Location(t.user.coordinates, LocationSource.TwitterUser, t.user.id))
                .filter(removeLocationDuplicates);
            const resourcesLocations = linkedEntities
                .filter(e => e.resource && e.resource.coordinates)
                .map(e => new Location(e.resource.coordinates, LocationSource.Resource, e.resource.url))
                .filter(removeLocationDuplicates);

            return {
                ...state,
                tweets: {
                    ...state.tweets,
                    all: [...tweets, ...state.tweets.all],
                },
                nilEntities: {
                    ...state.nilEntities,
                    all: [
                        ...state.nilEntities.all,
                        ...nilEntities
                            .filter(e => !state.nilEntities.tweetsCount[buildNilEntityIdentifier(e)]),
                    ],
                    tweetsCount: updateNilEntitiesTweetsCount(state.nilEntities.tweetsCount, nilEntities),
                },
                resources: {
                    ...state.resources,
                    all: [
                        ...state.resources.all,
                        ...resources.filter(r => !state.resources.tweetsCount[r.url]),
                    ],
                    tweetsCount: updateResourcesTweetsCount(state.resources.tweetsCount, linkedEntities),
                },
                locations: {
                    ...state.locations,
                    bySource: {
                        ...state.locations.bySource,
                        [LocationSource.Status]: [...state.locations.bySource[LocationSource.Status], ...statusesLocations],
                        [LocationSource.TwitterUser]: [
                            ...state.locations.bySource[LocationSource.TwitterUser],
                            ...usersLocations.filter(l => !state.locations._flags[l.source + l.ref])
                        ],
                        [LocationSource.Resource]: [
                            ...state.locations.bySource[LocationSource.Resource],
                            ...resourcesLocations.filter(l => !state.locations._flags[l.source + l.ref])
                        ],
                    },
                    _flags: updateLocationsFlags(state.locations._flags, statusesLocations.concat(usersLocations, resourcesLocations)),
                }
            };
        case ActionTypes.ClearTwitterNeelResults:
            return {
                ...initTwitterNeelState(),
                listeningAnalysisId: state.listeningAnalysisId
            };
        default:
            // console.log('TwitterNeelReducer', state, action);
            return state;
    }
}
