import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, withLatestFrom, filter } from 'rxjs/operators';
import * as TwitterNeelActions from './twitter-neel.action';
import * as AnalysisActions from 'app/analysis/store/analysis.action';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { TwitterNeelState } from 'app/analysis/twitter-neel';

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

    constructor(private action$: Actions, private store$: Store<TwitterNeelState>) {}
}
