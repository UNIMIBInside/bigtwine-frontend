import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, timer } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { AnalysisStatus, IAnalysis } from '../';
import { RxStompService } from '@stomp/ng2-stompjs';
import { map } from 'rxjs/operators';
import { IPagedAnalysisResults } from 'app/analysis/models/paged-analysis-results.model';
import { IAnalysisResultsCount } from 'app/analysis/models/analysis-results-count.model';
import { IPagedAnalyses } from 'app/analysis/models/paged-analyses.model';
import { Message } from 'webstomp-client';

export interface IAnalysisService {
    createAnalysis(analysis: IAnalysis): Observable<IAnalysis>;
    getAnalysisById(analysisId: string): Observable<IAnalysis>;
    getAnalyses(): Observable<IPagedAnalyses>;
    stopAnalysis(analysisId: string): Observable<IAnalysis>;
    startAnalysis(analysisId: string): Observable<IAnalysis>;
    completeAnalysis(analysisId: string): Observable<IAnalysis>;
    cancelAnalysis(analysisId: string): Observable<IAnalysis>;
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

    getAnalyses(): Observable<IPagedAnalyses> {
        return this.http.get(`${this.ANALYSIS_API}/analyses`) as Observable<IPagedAnalyses>;
    }

    stopAnalysis(analysisId: string): Observable<IAnalysis> {
        return this.updateAnalysis(analysisId, {status: AnalysisStatus.Stopped});
    }

    startAnalysis(analysisId: string): Observable<IAnalysis> {
        return this.updateAnalysis(analysisId, {status: AnalysisStatus.Started});
    }

    completeAnalysis(analysisId: string): Observable<IAnalysis> {
        return this.updateAnalysis(analysisId, {status: AnalysisStatus.Completed});
    }

    cancelAnalysis(analysisId: string): Observable<IAnalysis> {
        return this.http.delete(`${this.ANALYSIS_API}/analyses/${analysisId}`) as Observable<IAnalysis>;
    }

    updateAnalysis(analysisId: string, changes: IAnalysis): Observable<IAnalysis> {
        return this.http.patch(`${this.ANALYSIS_API}/analyses/${analysisId}`, changes) as Observable<IAnalysis>;
    }

    listenAnalysisStatusChanges(analysisId: string): Observable<IAnalysis> {
        this.stompService.activate();

        return this.stompService
            .watch(`/topic/analysis-changes/${analysisId}`)
            .pipe(map((message: Message) => JSON.parse(message.body)));
    }

    listenAnalysisResults(analysisId: string): Observable<any> {
        this.stompService.activate();

        return this.stompService.watch(`/topic/analysis-results/${analysisId}`)
            .pipe(map((message: Message) => JSON.parse(message.body)));
    }

    getAnalysisResults(analysisId: string, page = 1, pageSize = 250): Observable<IPagedAnalysisResults> {
        return this.http
            .get(`${this.ANALYSIS_API}/analyses-results/${analysisId}?page=${page}&pageSize=${pageSize}`) as Observable<IPagedAnalysisResults>;
    }

    searchAnalysisResults(analysisId: string, query: string, page = 1, pageSize = 250): Observable<IPagedAnalysisResults> {
        return this.http
            .post(`${this.ANALYSIS_API}/analyses-results/${analysisId}/search?page=${page}&pageSize=${pageSize}`, query) as Observable<IPagedAnalysisResults>;
    }

    countAnalysisResults(analysisId: string): Observable<IAnalysisResultsCount> {
        return this.http
            .get(`${this.ANALYSIS_API}/analyses-results/${analysisId}/count`) as Observable<IAnalysisResultsCount>;
    }
}
