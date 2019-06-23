import { initTwitterNeelState, TwitterNeelState } from './twitter-neel.state';
import * as TwitterNeelActions from './twitter-neel.action';
import { ActionTypes } from './twitter-neel.action';
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
                    byId: {...state.statuses.byId, ...statuses.reduce((o, t) => { o[t.id] = t; return o; } , {})},
                },
                entities: {
                    ...state.entities,
                    all: [...entities, ...state.entities.all],
                    linked: [...linkedEntities, ...state.entities.linked],
                    nil: [...nilEntities, ...state.entities.nil],
                    byStatusId: {...state.entities.byStatusId, ...tweets.reduce((o, t) => { o[t.status.id] = t.entities; return o; }, {})},
                    byLink: {...state.entities.byLink, ...entities.filter(e => !e.isNil).reduce((o, e) => { o[e.link] = e; return o; }, {})},
                },
                resources: {
                    ...state.resources,
                    all: [...linkedEntities.map(e => e.resource), ...state.resources.all],
                    byUrl: {...state.resources.byUrl, ...linkedEntities.reduce((o, e) => { o[e.resource.url] = e.resource; return o; }, {})},
                },
                locations: {
                    all: [...statusesLocations, ...usersLocations, ...resourcesLocations, ...state.locations.all],
                    bySource: {
                        [LocationSource.Status]: [...state.locations.bySource[LocationSource.Status], ...statusesLocations],
                        [LocationSource.TwitterUser]: [...state.locations.bySource[LocationSource.TwitterUser], ...usersLocations],
                        [LocationSource.Resource]: [...state.locations.bySource[LocationSource.Resource], ...resourcesLocations],
                    },
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
