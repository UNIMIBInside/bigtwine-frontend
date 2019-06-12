import { initTwitterNeelState, TwitterNeelState } from './twitter-neel.state';
import * as TwitterNeelActions from './twitter-neel.action';
import { ActionTypes } from './twitter-neel.action';
import { ILinkedEntity, IResource, ITwitterStatus } from 'app/analysis/twitter-neel/models/neel-processed-tweet.model';
import { Location, LocationSource } from 'app/analysis/twitter-neel/models/location.model';

export const initialState: TwitterNeelState = initTwitterNeelState();

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

            const statuses = tweets.map(t => t.status);
            const entities = tweets.filter(t => t.entities).reduce((a, t) => a.concat(t.entities), []);
            const linkedEntities = entities.filter(e => !e.isNil);
            const nilEntities = entities.filter(e => e.isNil);
            const statusesLocations = statuses
                .filter(t => t.coordinates)
                .map(t => new Location(t.coordinates, LocationSource.Status, t.id));
            const usersLocations = statuses
                .filter(t => t.user && t.user.coordinates)
                .map(t => new Location(t.user.coordinates, LocationSource.TwitterUser, t.user.id));
            const resourcesLocations = linkedEntities
                .filter(e => e.resource && e.resource.coordinates)
                .map(e => new Location(e.resource.coordinates, LocationSource.Resource, e.resource.url));

            return {
                ...state,
                tweets: [...state.tweets, ...tweets],
                statuses: {
                    ...state.statuses,
                    all: [...statuses, ...state.statuses.all],
                    byId: new Map([...state.statuses.byId, ...statuses.map(t => [t.id, t] as [string, ITwitterStatus])]),
                },
                entities: {
                    ...state.entities,
                    all: [...entities, ...state.entities.all],
                    linked: [...linkedEntities, ...state.entities.linked],
                    nil: [...nilEntities, ...state.entities.nil],
                    byStatusId: new Map([...state.entities.byStatusId, ...tweets.map(t => [t.status.id, t.entities] as [string, ILinkedEntity[]])]),
                    byLink: new Map([...state.entities.byLink, ...entities.filter(e => !e.isNil).map(e => [e.link, e] as [string, ILinkedEntity])]),
                },
                resources: {
                    ...state.resources,
                    all: [...linkedEntities.map(e => e.resource), ...state.resources.all],
                    byUrl: new Map([...state.resources.byUrl, ...linkedEntities.map(e => [e.resource.url, e.resource] as [string, IResource])]),
                },
                locations: {
                    all: [...statusesLocations, ...usersLocations, ...resourcesLocations, ...state.locations.all],
                    bySource: new Map([
                        [LocationSource.Status, [...state.locations.bySource.get(LocationSource.Status), ...statusesLocations]],
                        [LocationSource.TwitterUser, [...state.locations.bySource.get(LocationSource.TwitterUser), ...usersLocations]],
                        [LocationSource.Resource, [...state.locations.bySource.get(LocationSource.Resource), ...resourcesLocations]],
                    ]),
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
