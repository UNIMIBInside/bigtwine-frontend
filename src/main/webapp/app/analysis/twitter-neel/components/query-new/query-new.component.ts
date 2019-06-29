import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnalysisState } from 'app/analysis/store';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
    selector: 'btw-query-new',
    templateUrl: './query-new.component.html',
    styleUrls: ['./query-new.component.scss']
})
export class QueryNewComponent implements OnInit, OnDestroy {

    constructor(private router: Router, private analysisStore: Store<AnalysisState>) { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

}
