import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResultsViewerComponent } from 'app/analysis/twitter-neel/components/results-viewer.component';
import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectAllTweets, TwitterNeelState, INeelProcessedTweet } from 'app/analysis/twitter-neel';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, takeUntil, tap, throttleTime } from 'rxjs/operators';

@Component({
    selector: 'btw-list-results-viewer',
    templateUrl: './list-results-viewer.component.html',
    styleUrls: ['./list-results-viewer.component.scss']
})
export class ListResultsViewerComponent extends ResultsViewerComponent implements OnInit, OnDestroy {

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    tweets$: Observable<INeelProcessedTweet[]>;

    tweetsSearchFormControl = new FormControl('');
    filterQuery: string = null;

    filteredTweets$: Observable<INeelProcessedTweet[]>;
    paginatedTweets$: Observable<INeelProcessedTweet[]>;

    currentPage = 1;
    pageSize = 250;

    constructor(private tNeelStore: Store<TwitterNeelState>) {
        super();
    }

    ngOnInit() {
        this.tweets$ = this.tNeelStore.pipe(select(selectAllTweets));
        this.paginatedTweets$ = this.tweets$.pipe(
            map(tweets => tweets.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize))
        );

        this.tweetsSearchFormControl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe((query: string) => {
            this.onTweetsFilterQueryChange(query);
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    onTweetsFilterQueryChange(query: string) {
        this.filterQuery = query ? query : null;

        if (this.filterQuery) {
            this.filteredTweets$ = this.tweets$
                .pipe(
                    throttleTime(5000),
                    map(allTweets => allTweets.filter(t => t.status.text.indexOf(this.filterQuery) >= 0)),
                    map(tweets => tweets.slice(0, this.pageSize)),
                );
        }
    }

}
