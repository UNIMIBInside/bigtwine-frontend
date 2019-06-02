import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { IAnalysis } from '../';
import { RxStompService } from '@stomp/ng2-stompjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalysisService {

    readonly ANALYSIS_API = `${SERVER_API_URL}analysis/api`;

    private listenedAnalyses: { [key: string]: Observable<any> } = {};

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
        return this.updateAnalysis(analysisId, {status: 'stopped'});
    }

    startAnalysis(analysisId: string): Observable<IAnalysis> {
        return this.updateAnalysis(analysisId, {status: 'start'});
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

    private updateAnalysis(analysisId: string, analysis: IAnalysis): Observable<IAnalysis> {
        return this.http.patch(`${this.ANALYSIS_API}/analyses/${analysisId}`, analysis) as Observable<IAnalysis>;
    }
}
