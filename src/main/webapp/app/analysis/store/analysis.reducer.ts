import { initAnalysisState, AnalysisState } from './analysis.state';
import * as AnalysisActions from './analysis.action';
import { GenericAnalysisError } from './analysis.action';

export const initialState: AnalysisState = initAnalysisState();

function pushAnalysisError(state: AnalysisState, errAction: GenericAnalysisError) {
    const err = {
        type: errAction.type,
        error: errAction.error
    };
    return {
        ...state,
        lastError: err,
        errorHistory: [...state.errorHistory, err]
    };
}

export function AnalysisReducer(state = initialState, action: AnalysisActions.All): AnalysisState {
    switch (action.type) {
        case AnalysisActions.ActionTypes.GetAnalysisSuccess:
            return {
                ...state,
                lastError: null,
                currentAnalysis: (action as AnalysisActions.GetAnalysisSuccess).analysis
            };
        case AnalysisActions.ActionTypes.GetAnalysesSuccess:
            return {
                ...state,
                lastError: null,
                analyses: (action as AnalysisActions.GetAnalysesSuccess).analyses
            };
        case AnalysisActions.ActionTypes.CreateAnalysisSuccess:
            return {
                ...state,
                lastError: null,
                analyses: [(action as AnalysisActions.CreateAnalysisSuccess).analysis, ...state.analyses],
                currentAnalysis: (action as AnalysisActions.CreateAnalysisSuccess).analysis
            };
        case AnalysisActions.ActionTypes.AnalysisChangeReceived:
        case AnalysisActions.ActionTypes.UpdateAnalysisSuccess:
            const updatedAnalysis = (action as AnalysisActions.UpdateAnalysisSuccess).analysis;
            let currentAnalysis = state.currentAnalysis;
            if (currentAnalysis && currentAnalysis.id === updatedAnalysis.id) {
                currentAnalysis = {...currentAnalysis, ...updatedAnalysis};
            }

            return {
                ...state,
                lastError: null,
                analyses: state.analyses.map(a => (a.id === updatedAnalysis.id) ? updatedAnalysis : a),
                currentAnalysis
            };
        case AnalysisActions.ActionTypes.StartListenAnalysisChanges:
            return {
                ...state,
                changesListeningAnalysisId: (action as AnalysisActions.StartListenAnalysisChanges).analysisId
            };
        case AnalysisActions.ActionTypes.StopListenAnalysisChanges:
            return {
                ...state,
                changesListeningAnalysisId: null
            };
        case AnalysisActions.ActionTypes.StartListenAnalysisResults:
            return {
                ...state,
                resultsListeningAnalysisId: (action as AnalysisActions.StartListenAnalysisResults).analysisId
            };
        case AnalysisActions.ActionTypes.StopListenAnalysisResults:
            return {
                ...state,
                resultsListeningAnalysisId: null
            };
        case AnalysisActions.ActionTypes.ListeningAnalysisChangesError:
            return {
                ...pushAnalysisError(state, (action as AnalysisActions.GenericAnalysisError)),
                changesListeningAnalysisId: null
            };
        case AnalysisActions.ActionTypes.ListeningAnalysisResultsError:
            return {
                ...pushAnalysisError(state, (action as AnalysisActions.GenericAnalysisError)),
                resultsListeningAnalysisId: null
            };
        case AnalysisActions.ActionTypes.GetAnalysisError:
        case AnalysisActions.ActionTypes.GetAnalysesError:
        case AnalysisActions.ActionTypes.CreateAnalysisError:
        case AnalysisActions.ActionTypes.StartAnalysisError:
        case AnalysisActions.ActionTypes.StopAnalysisError:
        case AnalysisActions.ActionTypes.GenericAnalysisError:
            return pushAnalysisError(state, (action as AnalysisActions.GenericAnalysisError));
        default:
            return state;
    }
}
