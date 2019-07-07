import { Injectable } from '@angular/core';
import { AnalysisService } from 'app/analysis/services/analysis.service';
import { of, Observable } from 'rxjs';
import { bufferTime, catchError, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as AnalysisActions from './analysis.action';

@Injectable({providedIn: 'root'})
export class AnalysisEffects {

    @Effect()
    getAnalysis$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.GetAnalysis),
        mergeMap((action: AnalysisActions.GetAnalysis) => this.analysisService.getAnalysisById(action.analysisId)
            .pipe(
                map(analysis => new AnalysisActions.GetAnalysisSuccess(analysis)),
                catchError(e => of(new AnalysisActions.GetAnalysisError(e)))
            ))
    );

    @Effect()
    createAnalysis$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.CreateAnalysis),
        mergeMap((action: AnalysisActions.CreateAnalysis) => this.analysisService.createAnalysis(action.analysis)
            .pipe(
                map(analysis => new AnalysisActions.CreateAnalysisSuccess(analysis)),
                catchError(e => of(new AnalysisActions.CreateAnalysisError(e)))
            ))
    );

    @Effect()
    getAnalyses$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.GetAnalyses),
        mergeMap(() => this.analysisService.getAnalyses()
            .pipe(
                map(analyses => new AnalysisActions.GetAnalysesSuccess(analyses)),
                catchError(e => of(new AnalysisActions.GetAnalysesError(e)))
            ))
    );

    @Effect()
    startAnalysis$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.StartAnalysis),
        mergeMap((action: AnalysisActions.StartAnalysis) => this.analysisService.startAnalysis(action.analysisId)
            .pipe(
                map(analysis => new AnalysisActions.StartAnalysisSuccess(analysis)),
                catchError(e => of(new AnalysisActions.StartAnalysisError(e)))
            ))
    );

    @Effect()
    stopAnalysis$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.StopAnalysis),
        mergeMap((action: AnalysisActions.StopAnalysis) => this.analysisService.stopAnalysis(action.analysisId)
            .pipe(
                map(analysis => new AnalysisActions.StopAnalysisSuccess(analysis)),
                catchError(e => of(new AnalysisActions.StopAnalysisError(e)))
            ))
    );

    @Effect()
    completeAnalysis$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.CompleteAnalysis),
        mergeMap((action: AnalysisActions.CompleteAnalysis) => this.analysisService.completeAnalysis(action.analysisId)
            .pipe(
                map(analysis => new AnalysisActions.CompleteAnalysisSuccess(analysis)),
                catchError(e => of(new AnalysisActions.CompleteAnalysisError(e)))
            ))
    );

    @Effect()
    updateAnalysis$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.UpdateAnalysis),
        mergeMap((action: AnalysisActions.UpdateAnalysis) => this.analysisService.updateAnalysis(action.analysisId, action.changes)
            .pipe(
                map(analysis => new AnalysisActions.UpdateAnalysisSuccess(analysis)),
                catchError(e => of(new AnalysisActions.UpdateAnalysisError(e)))
            ))
    );

    @Effect()
    listenAnalysisChanges$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.StartListenAnalysisChanges),
        mergeMap((startAction: AnalysisActions.StartListenAnalysisChanges) => this.analysisService.listenAnalysisStatusChanges(startAction.analysisId)
            .pipe(
                map(analysis => new AnalysisActions.AnalysisChangeReceived(analysis)),
                catchError(e => of(new AnalysisActions.ListeningAnalysisChangesError(e))),
                takeUntil(
                    this.action$.pipe(
                        ofType(AnalysisActions.ActionTypes.StopListenAnalysisChanges),
                        filter((stopAction: AnalysisActions.StopListenAnalysisChanges) => stopAction.analysisId === null || stopAction.analysisId === startAction.analysisId)
                    )
                )
            ))
    );

    @Effect()
    listenAnalysisResults$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.StartListenAnalysisResults),
        mergeMap((startAction: AnalysisActions.StartListenAnalysisResults) => this.analysisService.listenAnalysisResults(startAction.analysisId)
            .pipe(
                bufferTime(1.0),
                filter(buffer => buffer.length > 0),
                map(results => new AnalysisActions.AnalysisResultsReceived(results)),
                catchError(e => of(new AnalysisActions.ListeningAnalysisResultsError(e))),
                takeUntil(
                    this.action$.pipe(
                        ofType(AnalysisActions.ActionTypes.StopListenAnalysisResults),
                        filter((stopAction: AnalysisActions.StopListenAnalysisResults) => stopAction.analysisId === null || stopAction.analysisId === startAction.analysisId)
                    )
                )
            ))
    );

    @Effect()
    getAnalysisResults$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.GetAnalysisResults),
        mergeMap((action: AnalysisActions.GetAnalysisResults) => this.analysisService.getAnalysisResults(action.analysisId, action.page, action.pageSize)
            .pipe(
                map(response => new AnalysisActions.GetAnalysisResultsSuccess(response.objects, response.page)),
                catchError(e => of(new AnalysisActions.GetAnalysisResultsError(e)))
            ))
    );

    @Effect()
    searchAnalysisResults$: Observable<Action> = this.action$.pipe(
        ofType(AnalysisActions.ActionTypes.SearchAnalysisResults),
        mergeMap((action: AnalysisActions.SearchAnalysisResults) => this.analysisService.searchAnalysisResults(action.analysisId, action.query, action.page, action.pageSize)
            .pipe(
                map(response => new AnalysisActions.SearchAnalysisResultsSuccess(response.objects, response.page)),
                catchError(e => of(new AnalysisActions.SearchAnalysisResultsError(e)))
            ))
    );

    constructor(private analysisService: AnalysisService, private action$: Actions) {}
}
