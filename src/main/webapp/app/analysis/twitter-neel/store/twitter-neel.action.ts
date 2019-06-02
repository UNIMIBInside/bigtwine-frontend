import { Action } from '@ngrx/store';

import { INeelProcessedTweet } from '../models/neel-processed-tweet.model';

export enum ActionTypes {
    StartListenTwitterNeelResults = '[TwitterNeel] StartListenTwitterNeelResults',
    StopListenTwitterNeelResults = '[TwitterNeel] StopListenTwitterNeelResults',
    TwitterNeelResultsReceived = '[TwitterNeel] TwitterNeelResultsReceived',
    ClearTwitterNeelResults = '[TwitterNeel] ClearTwitterNeelResults',
}

export class StartListenTwitterNeelResults implements Action {
    readonly type = ActionTypes.StartListenTwitterNeelResults;

    constructor(public analysisId: string) {}
}

export class StopListenTwitterNeelResults implements Action {
    readonly type = ActionTypes.StopListenTwitterNeelResults;

    constructor(public analysisId: string) {}
}

export class TwitterNeelResultsReceived implements Action {
    readonly type = ActionTypes.TwitterNeelResultsReceived;

    constructor(public results: INeelProcessedTweet[]) {}
}

export class ClearTwitterNeelResults implements Action {
    readonly type = ActionTypes.ClearTwitterNeelResults;

    constructor() {}
}

export type All = StartListenTwitterNeelResults | StopListenTwitterNeelResults | TwitterNeelResultsReceived | ClearTwitterNeelResults;
