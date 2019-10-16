import { AnalysisInputType, AnalysisStatus, AnalysisType, IAnalysis, IAnalysisExport, IAnalysisInput, IDocument, IPage, IResultsFilterQuery } from 'app/analysis';
import { interval, Observable, of, Subject, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { ILinkedEntity } from 'app/analysis/twitter-neel/models/neel-processed-tweet.model';
import { ICoordinates } from 'app/analysis/twitter-neel/models/coordinates.model';
import { IPagedAnalysisResults } from 'app/analysis/models/paged-analysis-results.model';
import { IAnalysisResultsCount } from 'app/analysis/models/analysis-results-count.model';
import { IAnalysisService } from 'app/analysis/services/analysis.service';
import { IPagedAnalyses } from 'app/analysis/models/paged-analyses.model';
import { IAnalysisResult } from 'app/analysis/models/analysis-result.model';

export class MockAnalysisService implements IAnalysisService {
    private analysisDb: Map<string, IAnalysis> = new Map();
    private analysisChangesSubscriptions: Map<string, Subject<IAnalysis>> = new Map();
    private lorem = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
    ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
    consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
    Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam,
    nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
    nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
    `;

    private uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            // tslint:disable-next-line no-bitwise
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r & 0x3 | 0x8 );
            return v.toString(16);
        });
    }

    private get rms() {
        return 500;
    }

    constructor() {
        const analysis1: IAnalysis = {
            id: 'analysis1',
            status: AnalysisStatus.Completed,
            input: {
                type: AnalysisInputType.Query,
                bounded: false,
                tokens: ['query', 'di', 'prova'],
                joinOperator: 'all',
            } as IAnalysisInput,
            type: AnalysisType.TwitterNeel,
            owner: {uid: 'user-1', username: 'User1'},
            progress: -1,
            resultsCount: 1239123
        };

        const analysis2: IAnalysis = {
            id: 'analysis2',
            status: AnalysisStatus.Started,
            input: {
                type: AnalysisInputType.Dataset,
                bounded: true,
                documentId: 'document-1',
                name: 'dataset.tsv',
                size: 3347744
            } as IAnalysisInput,
            type: AnalysisType.TwitterNeel,
            owner: {uid: 'user-1', username: 'User1'},
            progress: 0.6633838,
            resultsCount: 28283
        };

        const analysis3: IAnalysis = {
            id: 'analysis3',
            status: AnalysisStatus.Completed,
            input: {
                type: AnalysisInputType.Dataset,
                bounded: true,
                documentId: 'document-2',
                name: 'dataset-large.tsv',
                size: 28229011
            } as IAnalysisInput,
            type: AnalysisType.TwitterNeel,
            owner: {uid: 'user-1', username: 'User1'},
            progress: 1,
            resultsCount: 229283
        };

        this.analysisDb.set(analysis1.id, analysis1);
        this.analysisDb.set(analysis2.id, analysis2);
        this.analysisDb.set(analysis3.id, analysis3);
    }

    createAnalysis(analysis: IAnalysis): Observable<IAnalysis> {
        const overrides = {
            id: this.uuidv4(),
            status: AnalysisStatus.Ready,
        };
        const newAnalysis = Object.assign({}, analysis, overrides);

        this.analysisDb.set(newAnalysis.id, newAnalysis);

        return of(newAnalysis).pipe(delay(this.rms));
    }

    getAnalysisById(analysisId: string): Observable<IAnalysis> {
        if (this.analysisDb.has(analysisId)) {
            return of(this.analysisDb.get(analysisId)).pipe(delay(this.rms));
        } else {
            return throwError('Not found').pipe(delay(this.rms));
        }
    }

    getAnalyses(page: IPage = {page: 0, pageSize: 250}, type = null, owned = false): Observable<IPagedAnalyses> {
        return of({
            totalCount: this.analysisDb.size,
            page: 0,
            pageSize: 1000,
            count: this.analysisDb.size,
            objects: Array.from(this.analysisDb.values())
        }
        ).pipe(delay(this.rms));
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
        return this.updateAnalysis(analysisId, {status: AnalysisStatus.Cancelled});
    }

    updateAnalysis(analysisId: string, changes: IAnalysis): Observable<IAnalysis> {
        return of(analysisId).pipe(
            delay(this.rms * 3),
            map((aid: string) => {
                return this.analysisDb.get(aid);
            }),
            map((a: IAnalysis) => {
                const updated = Object.assign({}, a, changes);
                this.analysisDb.set(analysisId, updated);
                return updated;
            }),
            tap((a: IAnalysis) => {
                console.log('updateAnalysis', a.id, this.analysisChangesSubscriptions.has(a.id));
                if (this.analysisChangesSubscriptions.has(a.id)) {
                    this.analysisChangesSubscriptions.get(a.id).next(a);
                }
            })
        );
    }

    listenAnalysisStatusChanges(analysisId: string): Observable<IAnalysis> {
        console.log('listenAnalysisStatusChanges', analysisId);
        if (!this.analysisChangesSubscriptions.has(analysisId)) {
            const sub = new Subject<IAnalysis>();
            this.analysisChangesSubscriptions.set(analysisId, sub);
        }

        return this.analysisChangesSubscriptions.get(analysisId);
    }

    listenAnalysisResults(analysisId: string): Observable<any> {
        return interval(this.rms).pipe(map(() => {
            return this.createAnalysisResult(analysisId);
        }));
    }

    getAnalysisResults(analysisId: string, page: IPage = {page: 1, pageSize: 250}): Observable<IPagedAnalysisResults> {
        const tweets = [];
        for (let i = 0; i < page.pageSize; ++i) {
            tweets.push(this.createAnalysisResult(analysisId));
        }
        return of({
            page: page.page,
            pageSize: page.pageSize,
            totalCount: page.pageSize * 5,
            count: page.pageSize,
            objects: tweets
        }).pipe(delay(this.rms));
    }

    searchAnalysisResults(analysisId: string, query: IResultsFilterQuery, page: IPage = {page: 1, pageSize: 250}): Observable<IPagedAnalysisResults> {
        const tweets = [];
        for (let i = 0; i < page.pageSize; ++i) {
            tweets.push(this.createAnalysisResult(analysisId));
        }
        return of({
            page: page.page,
            pageSize: page.pageSize,
            totalCount: page.pageSize * 2,
            count: page.pageSize,
            objects: tweets
        }).pipe(delay(this.rms * 3));
    }

    countAnalysisResults(analysisId: string): Observable<IAnalysisResultsCount> {
        const response = {
            analysisId,
            count: Math.round(Math.random() * 1000),
            timestamp: (new Date()).toISOString()
        };
        return of(response).pipe(delay(this.rms));
    }

    exportAnalysisResults(analysisId: string): Observable<IAnalysisExport> {
        const response: IAnalysisExport = {
            documentId: this.uuidv4(),
            progress: 0.5,
            completed: false,
            failed: false,
            message: null
        };
        return of(response).pipe(delay(this.rms));
    }

    getDocumentById(documentId: string): Observable<IDocument> {
        return of({
            documentId,
            filename: 'testdocument.csv',
            size: Math.ceil(Math.random() * 100000000),
            contentType: 'text/csv',
            uploadDate: new Date(),
            user: {uid: 'user-1', username: 'user-1'},
        }).pipe(delay(this.rms));
    }

    getDocumentDownloadLink(documentId: string): string {
        return `/documents/${documentId}/download?access_token=jwt`;
    }

    private tweetText(len: number) {
        const s = Math.floor(Math.random() * (this.lorem.length - len));
        return this.lorem.substr(s, len).replace(/\n/g, ' ');
    }

    private createAnalysisResult(analysisId: string): IAnalysisResult {
        const tweetText = this.tweetText((Math.random() * 120) + 20);

        return {
            id: this.uuidv4(),
            analysisId,
            processDate: new Date(),
            saveDate: new Date(),
            payload: {
                status: {
                    id: this.uuidv4(),
                    text: tweetText,
                    user: {
                        id: this.uuidv4(),
                        name: 'user' + Math.random(),
                        screenName: 'user' + Math.random(),
                        location: '',
                        profileImageUrl: '',
                        coordinates: this.randomCoordinates(0.8),
                    },
                    coordinates: this.randomCoordinates(0.1)
                },
                entities: this.randomEntities(tweetText)
            }
        } as IAnalysisResult;
    }

    private randomCoordinates(prob = 1.0): ICoordinates {
        if (Math.random() < prob) {
            return {
                latitude: (Math.random() * 2 - 1) * 90,
                longitude: (Math.random() * 2 - 1) * 180,
            };
        } else {
            return null;
        }
    }

    private randomEntities(text: string): ILinkedEntity[] {
        const words = text.split(/\s+/).filter(w => w.length > 2);
        const c = Math.min((Math.random() * 5 - 2), words.length);
        const e: ILinkedEntity[] = [];

        const usedWords = [];
        for (let i = 0; i < c; ++i) {
            let word: string;
            do {
                word = words[Math.floor(Math.random() * words.length)];
            } while (usedWords.indexOf(word.toLowerCase()) >= 0);
            usedWords.push(word.toLowerCase());

            let d: ILinkedEntity;

            if (Math.random() > 0.33) {
                const url = 'http://dbpedia.org/resource/' + word;
                d = {
                    value: word,
                    isNil: false,
                    confidence: 1,
                    category: 'general',
                    link: url,
                    nilCluster: null,
                    position: {start: text.indexOf(word), end: text.indexOf(word) + word.length},
                    resource: {
                        name: 'Entity: ' + word,
                        shortDesc: '',
                        thumb: '',
                        thumbLarge: '',
                        url,
                        coordinates: this.randomCoordinates(0.5),
                    }
                };
            } else {
                d = {
                    value: word,
                    isNil: true,
                    confidence: 1,
                    category: 'general',
                    link: null,
                    nilCluster: '1',
                    position: {start: text.indexOf(word), end: text.indexOf(word) + word.length},
                    resource: null
                };
            }

            e.push(d);
        }

        return e;
    }
}
