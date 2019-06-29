import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, withLatestFrom, filter, mergeMap, bufferTime, catchError, takeUntil } from 'rxjs/operators';
import * as TwitterNeelActions from './twitter-neel.action';
import * as AnalysisActions from 'app/analysis/store/analysis.action';
import { Action, createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { TwitterNeelState } from 'app/analysis/twitter-neel';
import { interval, Observable, of } from 'rxjs';

@Injectable()
export class TwitterNeelEffects {
    @Effect()
    startListenTwitterNeelResults$ = this.action$.pipe(
        ofType(TwitterNeelActions.ActionTypes.StartListenTwitterNeelResults),
        map((action: TwitterNeelActions.StartListenTwitterNeelResults) => new AnalysisActions.StartListenAnalysisResults(action.analysisId))
    );

    @Effect()
    stopListenTwitterNeelResults$ = this.action$.pipe(
        ofType(TwitterNeelActions.ActionTypes.StopListenTwitterNeelResults),
        map((action: TwitterNeelActions.StopListenTwitterNeelResults) => new AnalysisActions.StopListenAnalysisResults(action.analysisId))
    );

    @Effect()
    twitterNeelResultReceived$ = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.AnalysisResultsReceived),
        withLatestFrom(this.store$.select(createSelector(createFeatureSelector('twitterNeel'), (state: TwitterNeelState)  => state.listeningAnalysisId))),
        filter(([action, listeningAnalysisId]: [AnalysisActions.AnalysisResultsReceived, string]) =>
                (listeningAnalysisId != null && action.results.length > 0 && action.results[0].analysisId === listeningAnalysisId)),
        map(([action]: [AnalysisActions.AnalysisResultsReceived, string]) => (new TwitterNeelActions.TwitterNeelResultsReceived(action.results))),
    );

    @Effect()
    sortTwitterNeelResult$: Observable<Action> = this.action$.pipe(
        ofType(TwitterNeelActions.ActionTypes.StartListenTwitterNeelResults),
        mergeMap((startAction: AnalysisActions.StartListenAnalysisResults) => interval(5000)
            .pipe(
                map(() => new TwitterNeelActions.SortTwitterNeelResults()),
                takeUntil(
                    this.action$.pipe(
                        ofType(TwitterNeelActions.ActionTypes.StopListenTwitterNeelResults),
                        filter((stopAction: AnalysisActions.StopListenAnalysisResults) => stopAction.analysisId === null || stopAction.analysisId === startAction.analysisId)
                    )
                )
            ))
    );

    constructor(private action$: Actions, private store$: Store<TwitterNeelState>) {}
}
