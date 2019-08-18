import { Component, OnInit } from '@angular/core';
import { AnalysisToolbarComponent } from 'app/analysis/components/analysis-toolbar/analysis-toolbar.component';
import { AnalysisInputType, AnalysisState, AnalysisStatus, AnalysisType } from 'app/analysis';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'btw-dataset-toolbar',
  templateUrl: './dataset-toolbar.component.html',
  styleUrls: ['./dataset-toolbar.component.scss']
})
export class DatasetToolbarComponent extends AnalysisToolbarComponent implements OnInit {
    get supportedAnalysisType(): AnalysisType {
        return AnalysisType.TwitterNeel;
    }

    get supportedInputType(): AnalysisInputType {
        return AnalysisInputType.Dataset;
    }

    constructor(protected router: Router, protected route: ActivatedRoute, protected analysisStore: Store<AnalysisState>) {
        super(router, route, analysisStore);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    get showStartButton() {
        return this.mode === 'view' && this.currentAnalysis && this.currentAnalysis.status === AnalysisStatus.Ready;
    }

    get showCancelButton() {
        return this.mode === 'view' && this.currentAnalysis && this.currentAnalysis.status === AnalysisStatus.Started;
    }

    onStartBtnClick() {
        this.startAnalysis(this.currentAnalysis);
    }

    onCancelBtnClick() {
        this.cancelAnalysis(this.currentAnalysis);
    }

}
