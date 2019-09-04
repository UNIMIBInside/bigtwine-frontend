import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { AnalysisStatus, IAnalysis, IAnalysisExport, IDocument, IPage, IResultsFilterQuery } from '../';
import { RxStompService } from '@stomp/ng2-stompjs';
import { map } from 'rxjs/operators';
import { IPagedAnalysisResults } from 'app/analysis/models/paged-analysis-results.model';
import { IAnalysisResultsCount } from 'app/analysis/models/analysis-results-count.model';
import { IPagedAnalyses } from 'app/analysis/models/paged-analyses.model';
import { Message } from 'webstomp-client';
import { AuthServerProvider } from 'app/core';

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
    getAnalysisResults(analysisId: string, page: IPage): Observable<IPagedAnalysisResults>;
    searchAnalysisResults(analysisId: string, query: IResultsFilterQuery, page: IPage): Observable<IPagedAnalysisResults>;
    countAnalysisResults(analysisId: string): Observable<IAnalysisResultsCount>;
    exportAnalysisResults(analysisId: string): Observable<IAnalysisExport>;
    getDocumentById(documentId: string): Observable<IDocument>;
    getDocumentDownloadLink(documentId: string): string;
}

@Injectable({ providedIn: 'root' })
export class AnalysisService implements IAnalysisService {

    readonly ANALYSIS_API = `${SERVER_API_URL}analysis/api/public`;

    constructor(
        private http: HttpClient,
        private stompService: RxStompService,
        private authService: AuthServerProvider
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

    getAnalysisResults(analysisId: string, page: IPage = {page: 0, pageSize: 250}): Observable<IPagedAnalysisResults> {
        return this.http
            .get(`${this.ANALYSIS_API}/analysis-results/${analysisId}?page=${page.page}&pageSize=${page.pageSize}`) as Observable<IPagedAnalysisResults>;
    }

    searchAnalysisResults(analysisId: string, query: IResultsFilterQuery, page: IPage = {page: 0, pageSize: 250}): Observable<IPagedAnalysisResults> {
        const url = `${this.ANALYSIS_API}/analysis-results/${analysisId}/search?page=${page.page}&pageSize=${page.pageSize}`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'text/plain',
            })
        };
        const body = this.buildSearchQuery(query);

        return this.http.post(url, body, httpOptions) as Observable<IPagedAnalysisResults>;
    }

    countAnalysisResults(analysisId: string): Observable<IAnalysisResultsCount> {
        return this.http
            .get(`${this.ANALYSIS_API}/analysis-results/${analysisId}/count`) as Observable<IAnalysisResultsCount>;
    }

    exportAnalysisResults(analysisId: string): Observable<IAnalysisExport> {
        return this.http
            .get(`${this.ANALYSIS_API}/analysis-results/${analysisId}/export`) as Observable<IAnalysisExport>;
    }

    getDocumentById(documentId: string): Observable<IDocument> {
        return this.http
            .get(`${this.ANALYSIS_API}/documents/${documentId}`) as Observable<IDocument>;
    }

    getDocumentDownloadLink(documentId: string): string {
        const jwt = this.authService.getToken();
        if (!jwt) {
            return null;
        }

        return `${this.ANALYSIS_API}/documents/${documentId}/download?access_token=${jwt}`;
    }

    private buildSearchQuery(query: IResultsFilterQuery): string {
        return `
            {$text: {$search: ${JSON.stringify(query.text)}, $caseSensitive: false}}
        `;
    }
}
