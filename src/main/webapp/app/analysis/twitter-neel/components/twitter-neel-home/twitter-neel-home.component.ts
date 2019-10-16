import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AnalysisListComponent } from 'app/analysis/components';

@Component({
    templateUrl: './twitter-neel-home.component.html',
    styleUrls: ['./twitter-neel-home.component.scss'],
    selector: 'btw-twitter-neel-home',
})
export class TwitterNeelHomeComponent implements OnInit, OnDestroy {

    @ViewChild(AnalysisListComponent) analysisListChild;
    private destroyed$ = new ReplaySubject<boolean>(1);

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    refresh() {
        this.analysisListChild.refresh();
    }
}
