import { Action } from '@ngrx/store';

import { INeelProcessedTweet } from '../models/neel-processed-tweet.model';

export enum ActionTypes {
    StartListenTwitterNeelResults = '[TwitterNeel] StartListenTwitterNeelResults',
    StopListenTwitterNeelResults = '[TwitterNeel] StopListenTwitterNeelResults',
    TwitterNeelResultsReceived = '[TwitterNeel] TwitterNeelResultsReceived',
    TwitterNeelSearchResultsReceived = '[TwitterNeel] TwitterNeelSearchResultsReceived',
    TwitterNeelPagedResultsReceived = '[TwitterNeel] TwitterNeelPagedResultsReceived',
    ClearTwitterNeelResults = '[TwitterNeel] ClearTwitterNeelResults',
    SortTwitterNeelResults = '[TwitterNeel] SortTwitterNeelResults',
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

export class TwitterNeelSearchResultsReceived implements Action {
    readonly type = ActionTypes.TwitterNeelSearchResultsReceived;

    constructor(public results: INeelProcessedTweet[], public page: number) {}
}

export class TwitterNeelPagedResultsReceived implements Action {
    readonly type = ActionTypes.TwitterNeelPagedResultsReceived;

    constructor(public results: INeelProcessedTweet[], public page: number) {}
}

export class ClearTwitterNeelResults implements Action {
    readonly type = ActionTypes.ClearTwitterNeelResults;

    constructor() {}
}

export class SortTwitterNeelResults implements Action {
    readonly type = ActionTypes.SortTwitterNeelResults;

    constructor() {}
}

export type All = StartListenTwitterNeelResults | StopListenTwitterNeelResults |
    TwitterNeelResultsReceived | TwitterNeelPagedResultsReceived | TwitterNeelSearchResultsReceived |
    ClearTwitterNeelResults | SortTwitterNeelResults;
