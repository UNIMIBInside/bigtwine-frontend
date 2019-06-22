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

export class GenericAnalysisError implements Action {
    constructor(readonly type = ActionTypes.GenericAnalysisError, public error: any) {}
}

export class GetAnalysis implements Action {
    readonly type = ActionTypes.GetAnalysis;

    constructor(public analysisId: string) {}
}

export class GetAnalysisSuccess implements Action {
    readonly type = ActionTypes.GetAnalysisSuccess;

    constructor(public analysis: IAnalysis) {}
}

export class GetAnalysisError extends GenericAnalysisError {
    constructor(public error: any) {
        super(ActionTypes.GetAnalysisError, error);
    }
}

export class GetAnalyses implements Action {
    readonly type = ActionTypes.GetAnalyses;
}

export class GetAnalysesSuccess implements Action {
    readonly type = ActionTypes.GetAnalysesSuccess;

    constructor(public analyses: IAnalysis[]) {}
}

export class GetAnalysesError extends GenericAnalysisError {
    constructor(public error: any) {
        super(ActionTypes.GetAnalysesError, error);
    }
}

export class CreateAnalysis implements Action {
    readonly type = ActionTypes.CreateAnalysis;

    constructor(public analysis: IAnalysis) {}
}

export class CreateAnalysisSuccess implements Action {
    readonly type = ActionTypes.CreateAnalysisSuccess;

    constructor(public analysis: IAnalysis) {}
}

export class CreateAnalysisError extends GenericAnalysisError {
    constructor(public error: any) {
        super(ActionTypes.CreateAnalysisError, error);
    }
}

export class StopAnalysis implements Action {
    readonly type = ActionTypes.StopAnalysis;

    constructor(public analysisId: string) {}
}

export class StopAnalysisSuccess implements Action {
    readonly type = ActionTypes.StopAnalysisSuccess;

    constructor(public analysis: IAnalysis) {}
}

export class StopAnalysisError extends GenericAnalysisError {
    constructor(public error: any) {
        super(ActionTypes.StopAnalysisError, error);
    }
}

export class StartAnalysis implements Action {
    readonly type = ActionTypes.StartAnalysis;

    constructor(public analysisId: string) {}
}

export class StartAnalysisSuccess implements Action {
    readonly type = ActionTypes.StartAnalysisSuccess;

    constructor(public analysis: IAnalysis) {}
}

export class StartAnalysisError extends GenericAnalysisError {
    constructor(public error: any) {
        super(ActionTypes.StartAnalysisError, error);
    }
}

export class UpdateAnalysis implements Action {
    readonly type = ActionTypes.UpdateAnalysis;

    constructor(public analysisId: string, public changes: IAnalysis) {}
}

export class UpdateAnalysisSuccess implements Action {
    readonly type = ActionTypes.UpdateAnalysisSuccess;

    constructor(public analysis: IAnalysis) {}
}

export class UpdateAnalysisError extends GenericAnalysisError {
    constructor(public error: any) {
        super(ActionTypes.UpdateAnalysisError, error);
    }
}

export class StartListenAnalysisChanges implements Action {
    readonly type = ActionTypes.StartListenAnalysisChanges;

    constructor(public analysisId: string) {}
}

export class StopListenAnalysisChanges implements Action {
    readonly type = ActionTypes.StopListenAnalysisChanges;

    /**
     * pass null to stop listen any analysis
     * @param analysisId
     */
    constructor(public analysisId?: string) {}
}

export class AnalysisChangeReceived implements Action {
    readonly type = ActionTypes.AnalysisChangeReceived;

    constructor(public analysis: IAnalysis) {}
}

export class ListeningAnalysisChangesError extends GenericAnalysisError {
    constructor(public error: any) {
        super(ActionTypes.ListeningAnalysisChangesError, error);
    }
}

export class StartListenAnalysisResults implements Action {
    readonly type = ActionTypes.StartListenAnalysisResults;

    constructor(public analysisId: string) {}
}

export class StopListenAnalysisResults implements Action {
    readonly type = ActionTypes.StopListenAnalysisResults;

    /**
     * pass null to stop listen any analysis
     * @param analysisId
     */
    constructor(public analysisId?: string) {}
}

export class AnalysisResultsReceived implements Action {
    readonly type = ActionTypes.AnalysisResultsReceived;

    constructor(public results: any[]) {}
}

export class ListeningAnalysisResultsError extends GenericAnalysisError {
    constructor(public error: any) {
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
