import { initAnalysisState, AnalysisState } from './analysis.state';
import * as AnalysisActions from './analysis.action';

export const initialState: AnalysisState = initAnalysisState();

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
                analyses: [(action as AnalysisActions.CreateAnalysisSuccess).analysis, ...state.analyses]
            };
        case AnalysisActions.ActionTypes.UpdateAnalysisSuccess:
            const updatedAnalysis = (action as AnalysisActions.UpdateAnalysisSuccess).analysis;
            return {
                ...state,
                lastError: null,
                analyses: state.analyses.map(a => (a.id === updatedAnalysis.id) ? updatedAnalysis : a)
            };
        case AnalysisActions.ActionTypes.AnalysisError:
            const err = (action as AnalysisActions.AnalysisError).error;
            return {
                ...state,
                lastError: err,
                errorHistory: [...state.errorHistory, err]
            };
        default:
            return state;
    }
}
