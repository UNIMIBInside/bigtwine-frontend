import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AnalysisState } from 'app/analysis/store';
import { ClearTwitterNeelResults, TwitterNeelState } from 'app/analysis/twitter-neel';

@Component({
    selector: 'btw-query-new',
    templateUrl: './query-new.component.html',
    styleUrls: ['./query-new.component.scss']
})
export class QueryNewComponent implements OnInit, OnDestroy {

    constructor(
        private router: Router,
        private analysisStore: Store<AnalysisState>,
        private tNeelStore: Store<TwitterNeelState>) { }

    ngOnInit() {
        this.tNeelStore.dispatch(new ClearTwitterNeelResults());
    }

    ngOnDestroy() {
    }

}
