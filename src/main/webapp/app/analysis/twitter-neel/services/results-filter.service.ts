import { Injectable } from '@angular/core';
import { AnalysisState, IAnalysis, selectCurrentAnalysis } from 'app/analysis';
import { filter, map, take, takeUntil, throttleTime } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { INeelProcessedTweet, selectAllTweets, TwitterNeelState } from 'app/analysis/twitter-neel';

export interface IResultsFilterQuery {
    text: string;
    page: number;
    pageSize: number;
}

@Injectable()
export class ResultsFilterService {
    private currentAnalysis$: Observable<IAnalysis>;
    private tweets$: Observable<INeelProcessedTweet[]>;
    private _filteredTweets$ = new BehaviorSubject<INeelProcessedTweet[]>(null);
    private _currentQuery: IResultsFilterQuery;
    private _currentQuery$ = new BehaviorSubject<IResultsFilterQuery>(null);

    get filteredTweets$() {
        return this._filteredTweets$;
    }

    get currentQuery() {
        return this._currentQuery;
    }

    get currentQuery$() {
        return this._currentQuery$;
    }

    get currentAnalysis(): IAnalysis {
        let currentAnalysis: IAnalysis = null;
        this.currentAnalysis$
            .pipe(take(1))
            .subscribe((analysis: IAnalysis) => currentAnalysis = analysis);

        return currentAnalysis;
    }

    constructor(private analysisStore: Store<AnalysisState>, private tNeelStore: Store<TwitterNeelState>) {
        this.currentAnalysis$ = this.analysisStore.pipe(select(selectCurrentAnalysis));
        this.tweets$ = this.tNeelStore.pipe(select(selectAllTweets));
    }

    /**
     * Avvia una ricerca sui risultati disponibili localmente
     * @param query
     * @param throttleDuration
     */
    localSearch(query: IResultsFilterQuery, throttleDuration = 5000) {
        if (!query) {
            return;
        }

        this._currentQuery = query;
        this._currentQuery$.next(query);
        this.tweets$
            .pipe(
                throttleTime(throttleDuration),
                map(allTweets => allTweets.filter(t => t.status.text.indexOf(query.text) >= 0)),
                map(tweets => tweets.slice(0, query.pageSize)),
                takeUntil(this._currentQuery$.pipe(filter(q => q !== query))),
            )
            .subscribe(tweets => {
                this._filteredTweets$.next(tweets);
            });
    }

    clear() {
        this._currentQuery = null;
        this._currentQuery$.next(null);
        this._filteredTweets$.next(null);
    }
}
