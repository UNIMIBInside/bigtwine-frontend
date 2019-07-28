import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, timer } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { AnalysisStatus, IAnalysis } from '../';
import { RxStompService } from '@stomp/ng2-stompjs';
import { map } from 'rxjs/operators';
import { IPagedAnalysisResults } from 'app/analysis/models/paged-analysis-results.model';
import { IAnalysisResultsCount } from 'app/analysis/models/analysis-results-count.model';

export interface IAnalysisService {
    createAnalysis(analysis: IAnalysis): Observable<IAnalysis>;
    getAnalysisById(analysisId: string): Observable<IAnalysis>;
    getAnalyses(): Observable<IAnalysis[]>;
    stopAnalysis(analysisId: string): Observable<IAnalysis>;
    startAnalysis(analysisId: string): Observable<IAnalysis>;
    completeAnalysis(analysisId: string): Observable<IAnalysis>;
    updateAnalysis(analysisId: string, changes: IAnalysis): Observable<IAnalysis>;
    listenAnalysisStatusChanges(analysisId: string): Observable<IAnalysis>;
    listenAnalysisResults(analysisId: string): Observable<any>;
    getAnalysisResults(analysisId: string, page: number, pageSize: number): Observable<IPagedAnalysisResults>;
    searchAnalysisResults(analysisId: string, query: string, page: number, pageSize: number): Observable<IPagedAnalysisResults>;
    countAnalysisResults(analysisId: string): Observable<IAnalysisResultsCount>;
}

@Injectable({ providedIn: 'root' })
export class AnalysisService implements IAnalysisService {

    readonly ANALYSIS_API = `${SERVER_API_URL}analysis/api/public`;

    constructor(
        private http: HttpClient,
        private stompService: RxStompService
    ) {}

    createAnalysis(analysis: IAnalysis): Observable<IAnalysis> {
        return this.http.post(`${this.ANALYSIS_API}/analyses`, analysis) as Observable<IAnalysis>;
    }

    getAnalysisById(analysisId: string): Observable<IAnalysis> {
        return this.http.get(`${this.ANALYSIS_API}/analyses/${analysisId}`) as Observable<IAnalysis>;
    }

    getAnalyses(): Observable<IAnalysis[]> {
        return this.http.get(`${this.ANALYSIS_API}/analyses`) as Observable<IAnalysis[]>;
    }

    stopAnalysis(analysisId: string): Observable<IAnalysis> {
        return this.updateAnalysis(analysisId, {status: AnalysisStatus.Stopped});
    }

    startAnalysis(analysisId: string): Observable<IAnalysis> {
        return this.updateAnalysis(analysisId, {status: AnalysisStatus.Running});
    }

    completeAnalysis(analysisId: string): Observable<IAnalysis> {
        return this.updateAnalysis(analysisId, {status: AnalysisStatus.Completed});
    }

    updateAnalysis(analysisId: string, changes: IAnalysis): Observable<IAnalysis> {
        return this.http.patch(`${this.ANALYSIS_API}/analyses/${analysisId}`, changes) as Observable<IAnalysis>;
    }

    listenAnalysisStatusChanges(analysisId: string): Observable<IAnalysis> {
        if (analysisId in this.listenedAnalyses) {
            return this.listenedAnalyses[analysisId];
        }

        this.stompService.activate();
        this.listenedAnalyses[analysisId] =  this.stompService.watch(`/topic/analysis/${analysisId}/changes`);

        return this.listenedAnalyses[analysisId];
    }

    listenAnalysisResults(analysisId: string): Observable<any> {
        return timer(1000, 1000).pipe(
            map((n: number) => ({id: n, text: 'Prova ' + n + ' (' + analysisId + ')', analysisId}))
        );
    }

    getAnalysisResults(analysisId: string, page = 1, pageSize = 250): Observable<IPagedAnalysisResults> {
        return EMPTY;
    }

    searchAnalysisResults(analysisId: string, query: string, page = 1, pageSize = 250): Observable<IPagedAnalysisResults> {
        return EMPTY;
    }

    countAnalysisResults(analysisId: string): Observable<IAnalysisResultsCount> {
        return EMPTY;
    }
}
