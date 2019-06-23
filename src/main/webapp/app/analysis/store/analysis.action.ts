import {Action} from '@ngrx/store';
import {IAnalysis} from 'app/analysis';

export enum ActionTypes {
    GetAnalysis = '[Analysis] GET_ANALYSIS',
    GetAnalysisSuccess = '[Analysis] GET_ANALYSIS_SUCCESS',
    GetAnalysisError = '[Analysis] GET_ANALYSIS_ERROR',
    CreateAnalysis = '[Analysis] CREATE_ANALYSIS',
    CreateAnalysisSuccess = '[Analysis] CREATE_ANALYSIS_SUCCESS',
    CreateAnalysisError = '[Analysis] CREATE_ANALYSIS_ERROR',
    GetAnalyses = '[Analysis] GET_ANALYSES',
    GetAnalysesSuccess = '[Analysis] GET_ANALYSES_SUCCESS',
    GetAnalysesError = '[Analysis] GET_ANALYSES_ERROR',
    StopAnalysis = '[Analysis] STOP_ANALYSIS',
    StopAnalysisSuccess = '[Analysis] STOP_ANALYSIS_SUCCESS',
    StopAnalysisError = '[Analysis] STOP_ANALYSIS_ERROR',
    StartAnalysis = '[Analysis] START_ANALYSIS',
    StartAnalysisSuccess = '[Analysis] START_ANALYSIS_SUCCESS',
    StartAnalysisError = '[Analysis] START_ANALYSIS_ERROR',
    UpdateAnalysis = '[Analysis] UPDATE_ANALYSIS',
    UpdateAnalysisSuccess = '[Analysis] UPDATE_ANALYSIS_SUCCESS',
    UpdateAnalysisError = '[Analysis] UPDATE_ANALYSIS_ERROR',
    StartListenAnalysisChanges = '[Analysis] START_LISTEN_ANALYSIS_CHANGES',
    StopListenAnalysisChanges = '[Analysis] STOP_LISTEN_ANALYSIS_CHANGES',
    AnalysisChangeReceived = '[Analysis] ANALYSIS_CHANGE_RECEIVED',
    ListeningAnalysisChangesError = '[Analysis] LISTENING_ANALYSIS_CHANGES_ERROR',
    StartListenAnalysisResults = '[Analysis] START_LISTEN_ANALYSIS_RESULTS',
    StopListenAnalysisResults = '[Analysis] STOP_LISTEN_ANALYSIS_RESULTS',
    ListeningAnalysisResultsError = '[Analysis] LISTENING_ANALYSIS_RESULTS_ERROR',
    AnalysisResultsReceived = '[Analysis] ANALYSIS_RESULTS_RECEIVED',
    GenericAnalysisError = '[Analysis] GENERIC_ANALYSIS_ERROR',
}

export interface ActionWithAnalysis {
    readonly analysis: IAnalysis;
}

export class GenericAnalysisError implements Action {
    constructor(readonly type = ActionTypes.GenericAnalysisError, readonly error: any) {}
}

export class GetAnalysis implements Action {
    readonly type = ActionTypes.GetAnalysis;

    constructor(readonly analysisId: string) {}
}

export class GetAnalysisSuccess implements Action, ActionWithAnalysis {
    readonly type = ActionTypes.GetAnalysisSuccess;

    constructor(readonly analysis: IAnalysis) {}
}

export class GetAnalysisError extends GenericAnalysisError {
    constructor(readonly error: any) {
        super(ActionTypes.GetAnalysisError, error);
    }
}

export class GetAnalyses implements Action {
    readonly type = ActionTypes.GetAnalyses;
}

export class GetAnalysesSuccess implements Action {
    readonly type = ActionTypes.GetAnalysesSuccess;

    constructor(readonly analyses: IAnalysis[]) {}
}

export class GetAnalysesError extends GenericAnalysisError {
    constructor(readonly error: any) {
        super(ActionTypes.GetAnalysesError, error);
    }
}

export class CreateAnalysis implements Action, ActionWithAnalysis {
    readonly type = ActionTypes.CreateAnalysis;

    constructor(readonly analysis: IAnalysis) {}
}

export class CreateAnalysisSuccess implements Action, ActionWithAnalysis {
    readonly type = ActionTypes.CreateAnalysisSuccess;

    constructor(readonly analysis: IAnalysis) {}
}

export class CreateAnalysisError extends GenericAnalysisError {
    constructor(readonly error: any) {
        super(ActionTypes.CreateAnalysisError, error);
    }
}

export class StopAnalysis implements Action {
    readonly type = ActionTypes.StopAnalysis;

    constructor(readonly analysisId: string) {}
}

export class StopAnalysisSuccess implements Action, ActionWithAnalysis {
    readonly type = ActionTypes.StopAnalysisSuccess;

    constructor(readonly analysis: IAnalysis) {}
}

export class StopAnalysisError extends GenericAnalysisError {
    constructor(readonly error: any) {
        super(ActionTypes.StopAnalysisError, error);
    }
}

export class StartAnalysis implements Action {
    readonly type = ActionTypes.StartAnalysis;

    constructor(readonly analysisId: string) {}
}

export class StartAnalysisSuccess implements Action, ActionWithAnalysis {
    readonly type = ActionTypes.StartAnalysisSuccess;

    constructor(readonly analysis: IAnalysis) {}
}

export class StartAnalysisError extends GenericAnalysisError {
    constructor(readonly error: any) {
        super(ActionTypes.StartAnalysisError, error);
    }
}

export class UpdateAnalysis implements Action {
    readonly type = ActionTypes.UpdateAnalysis;

    constructor(readonly analysisId: string, public changes: IAnalysis) {}
}

export class UpdateAnalysisSuccess implements Action, ActionWithAnalysis {
    readonly type = ActionTypes.UpdateAnalysisSuccess;

    constructor(readonly analysis: IAnalysis) {}
}

export class UpdateAnalysisError extends GenericAnalysisError {
    constructor(readonly error: any) {
        super(ActionTypes.UpdateAnalysisError, error);
    }
}

export class StartListenAnalysisChanges implements Action {
    readonly type = ActionTypes.StartListenAnalysisChanges;

    constructor(readonly analysisId: string) {}
}

export class StopListenAnalysisChanges implements Action {
    readonly type = ActionTypes.StopListenAnalysisChanges;

    /**
     * pass null to stop listen any analysis
     * @param analysisId
     */
    constructor(readonly analysisId?: string) {}
}

export class AnalysisChangeReceived implements Action, ActionWithAnalysis {
    readonly type = ActionTypes.AnalysisChangeReceived;

    constructor(readonly analysis: IAnalysis) {}
}

export class ListeningAnalysisChangesError extends GenericAnalysisError {
    constructor(readonly error: any) {
        super(ActionTypes.ListeningAnalysisChangesError, error);
    }
}

export class StartListenAnalysisResults implements Action {
    readonly type = ActionTypes.StartListenAnalysisResults;

    constructor(readonly analysisId: string) {}
}

export class StopListenAnalysisResults implements Action {
    readonly type = ActionTypes.StopListenAnalysisResults;

    /**
     * pass null to stop listen any analysis
     * @param analysisId
     */
    constructor(readonly analysisId?: string) {}
}

export class AnalysisResultsReceived implements Action {
    readonly type = ActionTypes.AnalysisResultsReceived;

    constructor(readonly results: any[]) {}
}

export class ListeningAnalysisResultsError extends GenericAnalysisError {
    constructor(readonly error: any) {
        super(ActionTypes.ListeningAnalysisResultsError, error);
    }
}

export type All = GetAnalysis | GetAnalysisSuccess | GetAnalysisError |
    GetAnalyses | GetAnalysesSuccess | GetAnalysesError |
    CreateAnalysis | CreateAnalysisSuccess | CreateAnalysisError |
    StartAnalysis | StartAnalysisSuccess | StartAnalysisError |
    StopAnalysis | StopAnalysisSuccess | StopAnalysisError |
    UpdateAnalysis | UpdateAnalysisSuccess | UpdateAnalysisError |
    StartListenAnalysisChanges | StopListenAnalysisChanges | AnalysisChangeReceived | ListeningAnalysisChangesError |
    StartListenAnalysisResults | StopListenAnalysisResults | AnalysisResultsReceived | ListeningAnalysisResultsError |
    GenericAnalysisError;
