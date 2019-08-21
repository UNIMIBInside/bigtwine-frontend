import { initAnalysisState, AnalysisState } from './analysis.state';
import * as AnalysisActions from './analysis.action';

export const initialState: AnalysisState = initAnalysisState();

function pushLastError(state: AnalysisState, errAction: AnalysisActions.GenericAnalysisError) {
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

function clearLastError(state: AnalysisState) {
    return {
        ...state,
        lastError: null,
    };
}

export function AnalysisReducer(state = initialState, action: AnalysisActions.All): AnalysisState {
    switch (action.type) {
        case AnalysisActions.ActionTypes.GetAnalysisSuccess:
            return {
                ...clearLastError(state),
                currentAnalysis: (action as AnalysisActions.GetAnalysisSuccess).analysis
            };
        case AnalysisActions.ActionTypes.GetAnalysesSuccess:
            const act = action as AnalysisActions.GetAnalysesSuccess;
            const analysesById = {...state.analyses.byId, ...act.analyses.reduce((o: any, a) => { o[a.id] = a; return o; }, {})};
            return {
                ...clearLastError(state),
                analyses: {
                    ...state.analyses,
                    all: Object.keys(analysesById).map(k => analysesById[k]),
                    byId: analysesById,
                }
            };
        case AnalysisActions.ActionTypes.CreateAnalysisSuccess:
            const analysis = (action as AnalysisActions.CreateAnalysisSuccess).analysis;
            return {
                ...clearLastError(state),
                analyses: {
                    ...state.analyses,
                    all: [...state.analyses.all, analysis],
                    byId: {...state.analyses.byId, ...{[analysis.id]: analysis}}
                },
                currentAnalysis: analysis
            };
        case AnalysisActions.ActionTypes.StartAnalysisSuccess:
        case AnalysisActions.ActionTypes.StopAnalysisSuccess:
        case AnalysisActions.ActionTypes.CompleteAnalysisSuccess:
        case AnalysisActions.ActionTypes.CancelAnalysisSuccess:
        case AnalysisActions.ActionTypes.AnalysisChangeReceived:
        case AnalysisActions.ActionTypes.UpdateAnalysisSuccess:
            const updatedAnalysis = (action as AnalysisActions.ActionWithAnalysis).analysis;
            let currentAnalysis = state.currentAnalysis;
            if (currentAnalysis && currentAnalysis.id === updatedAnalysis.id) {
                currentAnalysis = {...currentAnalysis, ...updatedAnalysis};
            }

            return {
                ...clearLastError(state),
                analyses: {
                    ...state.analyses,
                    all: state.analyses.all.map(a => (a.id === updatedAnalysis.id) ? updatedAnalysis : a),
                    byId: {...state.analyses.byId, ...{[updatedAnalysis.id]: updatedAnalysis}},
                },
                currentAnalysis
            };

        case AnalysisActions.ActionTypes.AnalysisResultsReceived:
            return {
                ...clearLastError(state),
                resultsPagination: {
                    ...state.resultsPagination,
                    enabled: false,
                }
            };
        case AnalysisActions.ActionTypes.GetAnalysisResultsSuccess:
            const getResActionSuc = action as AnalysisActions.GetAnalysisResultsSuccess;
            return {
                ...clearLastError(state),
                resultsPagination: {
                    ...state.resultsPagination,
                    enabled: true,
                    currentPage: getResActionSuc.pageDetails.page,
                    pageSize: getResActionSuc.pageDetails.pageSize,
                    allItemsCount: getResActionSuc.pageDetails.totalCount,
                    pagesCount: Math.ceil(getResActionSuc.pageDetails.totalCount / getResActionSuc.pageDetails.pageSize)
                }
            };
        case AnalysisActions.ActionTypes.SearchAnalysisResults:
            const searchAction = action as AnalysisActions.SearchAnalysisResults;
            return {
                ...state,
                resultsFilters: {
                    ...state.resultsFilters,
                    query: searchAction.query
                }
            };
        case AnalysisActions.ActionTypes.SearchAnalysisResultsSuccess:
            const searchActionSuc = action as AnalysisActions.SearchAnalysisResultsSuccess;
            return {
                ...clearLastError(state),
                resultsFilters: {
                    ...state.resultsFilters,
                    pagination: {
                        ...state.resultsFilters.pagination,
                        enabled: true,
                        currentPage: searchActionSuc.pageDetails.page,
                        pageSize: searchActionSuc.pageDetails.pageSize,
                        allItemsCount: searchActionSuc.pageDetails.totalCount,
                        pagesCount: Math.ceil(searchActionSuc.pageDetails.totalCount / searchActionSuc.pageDetails.pageSize)
                    }
                }
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
                ...pushLastError(state, (action as AnalysisActions.GenericAnalysisError)),
                changesListeningAnalysisId: null
            };
        case AnalysisActions.ActionTypes.ListeningAnalysisResultsError:
            return {
                ...pushLastError(state, (action as AnalysisActions.GenericAnalysisError)),
                resultsListeningAnalysisId: null
            };
        case AnalysisActions.ActionTypes.GetAnalysisError:
        case AnalysisActions.ActionTypes.GetAnalysesError:
        case AnalysisActions.ActionTypes.CreateAnalysisError:
        case AnalysisActions.ActionTypes.StartAnalysisError:
        case AnalysisActions.ActionTypes.StopAnalysisError:
        case AnalysisActions.ActionTypes.CompleteAnalysisError:
        case AnalysisActions.ActionTypes.CancelAnalysisError:
        case AnalysisActions.ActionTypes.SearchAnalysisResultsError:
        case AnalysisActions.ActionTypes.GetAnalysisResultsError:
        case AnalysisActions.ActionTypes.GenericAnalysisError:
            return pushLastError(state, (action as AnalysisActions.GenericAnalysisError));
        default:
            return state;
    }
}
