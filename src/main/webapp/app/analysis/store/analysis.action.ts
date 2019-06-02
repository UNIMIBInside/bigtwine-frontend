import {Action} from '@ngrx/store';
import {IAnalysis} from 'app/analysis';

export enum ActionTypes {
    GetAnalysis = '[Analysis] GET_ANALYSIS',
    GetAnalysisSuccess = '[Analysis] GET_ANALYSIS_SUCCESS',
    CreateAnalysis = '[Analysis] CREATE_ANALYSIS',
    CreateAnalysisSuccess = '[Analysis] CREATE_ANALYSIS_SUCCESS',
    GetAnalyses = '[Analysis] GET_ANALYSES',
    GetAnalysesSuccess = '[Analysis] GET_ANALYSES_SUCCESS',
    StopAnalysis = '[Analysis] STOP_ANALYSIS',
    StopAnalysisSuccess = '[Analysis] STOP_ANALYSIS_SUCCESS',
    StartAnalysis = '[Analysis] START_ANALYSIS',
    StartAnalysisSuccess = '[Analysis] START_ANALYSIS_SUCCESS',
    UpdateAnalysisSuccess = '[Analysis] UPDATE_ANALYSIS_SUCCESS',
    StartListenAnalysisChanges = '[Analysis] START_LISTEN_ANALYSIS_CHANGES',
    StopListenAnalysisChanges = '[Analysis] STOP_LISTEN_ANALYSIS_CHANGES',
    AnalysisChanged = '[Analysis] ANALYSIS_CHANGED',
    StartListenAnalysisResults = '[Analysis] START_LISTEN_ANALYSIS_RESULTS',
    StopListenAnalysisResults = '[Analysis] STOP_LISTEN_ANALYSIS_RESULTS',
    AnalysisResultsReceived = '[Analysis] ANALYSIS_RESULTS_RECEIVED',
    AnalysisError = '[Analysis] ANALYSIS_ERROR',
}

export class GetAnalysis implements Action {
    readonly type = ActionTypes.GetAnalysis;

    constructor(public analysisId: string) {}
}

export class GetAnalysisSuccess implements Action {
    readonly type = ActionTypes.GetAnalysisSuccess;

    constructor(public analysis: IAnalysis) {}
}

export class GetAnalyses implements Action {
    readonly type = ActionTypes.GetAnalyses;
}

export class GetAnalysesSuccess implements Action {
    readonly type = ActionTypes.GetAnalysesSuccess;

    constructor(public analyses: IAnalysis[]) {}
}

export class CreateAnalysis implements Action {
    readonly type = ActionTypes.CreateAnalysis;

    constructor(public analysis: IAnalysis) {}
}

export class CreateAnalysisSuccess implements Action {
    readonly type = ActionTypes.CreateAnalysisSuccess;

    constructor(public analysis: IAnalysis) {}
}

export class StopAnalysis implements Action {
    readonly type = ActionTypes.StopAnalysis;

    constructor(public analysisId: string) {}
}

export class StopAnalysisSuccess implements Action {
    readonly type = ActionTypes.StopAnalysisSuccess;

    constructor(public analysis: IAnalysis) {}
}

export class StartAnalysis implements Action {
    readonly type = ActionTypes.StartAnalysis;

    constructor(public analysisId: string) {}
}

export class StartAnalysisSuccess implements Action {
    readonly type = ActionTypes.StartAnalysisSuccess;

    constructor(public analysis: IAnalysis) {}
}

export class UpdateAnalysisSuccess implements Action {
    readonly type = ActionTypes.UpdateAnalysisSuccess;

    constructor(public analysis: IAnalysis) {}
}

export class StartListenAnalysisChanges implements Action {
    readonly type = ActionTypes.StartListenAnalysisChanges;

    constructor(public analysisId: string) {}
}

export class StopListenAnalysisChanges implements Action {
    readonly type = ActionTypes.StopListenAnalysisChanges;

    constructor(public analysisId: string) {}
}

export class AnalysisChanged implements Action {
    readonly type = ActionTypes.AnalysisChanged;

    constructor(public analysis: IAnalysis) {}
}

export class StartListenAnalysisResults implements Action {
    readonly type = ActionTypes.StartListenAnalysisResults;

    constructor(public analysisId: string) {}
}

export class StopListenAnalysisResults implements Action {
    readonly type = ActionTypes.StopListenAnalysisResults;

    constructor(public analysisId: string) {}
}

export class AnalysisResultsReceived implements Action {
    readonly type = ActionTypes.AnalysisResultsReceived;

    constructor(public results: any[]) {}
}

export class AnalysisError implements Action {
    readonly type = ActionTypes.AnalysisError;

    constructor(public error: any) {}
}

export type All = GetAnalysis | GetAnalysisSuccess | GetAnalyses |
    GetAnalysesSuccess | CreateAnalysis | CreateAnalysisSuccess |
    StopAnalysis | StartAnalysis | UpdateAnalysisSuccess |
    StartListenAnalysisChanges | StopListenAnalysisChanges |
    AnalysisChanged | AnalysisError;
