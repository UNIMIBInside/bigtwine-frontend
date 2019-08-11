import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    AnalysisState,
} from 'app/analysis/store';
import { AnalysisInputType, AnalysisStatus, AnalysisType, IQueryAnalysisInput } from 'app/analysis';
import { AnalysisToolbarComponent } from 'app/analysis/components/analysis-toolbar.component';

@Component({
    selector: 'btw-query-toolbar',
    templateUrl: './query-toolbar.component.html',
    styleUrls: ['./query-toolbar.component.scss']
})
export class QueryToolbarComponent extends AnalysisToolbarComponent {

    get query(): IQueryAnalysisInput {
        return this.input as IQueryAnalysisInput;
    }

    set query(query: IQueryAnalysisInput) {
        query.type = AnalysisInputType.Query;
        this.input = query;
    }

    get supportedAnalysisType(): AnalysisType {
        return AnalysisType.TwitterNeel;
    }

    get supportedInputType(): AnalysisInputType {
        return AnalysisInputType.Query;
    }

    get showCreateButton() {
        return this.mode === 'new' || (this.currentAnalysis && JSON.stringify(this.currentAnalysis.input) !== JSON.stringify(this.query));
    }

    get showStartStopButton() {
        return !this.showCreateButton && this.currentAnalysis && this.currentAnalysis.status !== AnalysisStatus.Completed;
    }

    get showCompleteButton() {
        return this.mode === 'view' && this.currentAnalysis && this.currentAnalysis.status === AnalysisStatus.Started;
    }

    constructor(protected router: Router, protected route: ActivatedRoute, protected analysisStore: Store<AnalysisState>) {
        super(router, route, analysisStore);
    }

    onQueryChange(query) {
        this.query = query;
    }

    onCreateBtnClick() {
        this.createAnalysis();
    }

    onToggleAnalysisBtnClick() {
        if (this.currentAnalysis) {
            if (this.currentAnalysis.status === AnalysisStatus.Ready || this.currentAnalysis.status === AnalysisStatus.Stopped) {
                this.startAnalysis(this.currentAnalysis);
            } else if (this.currentAnalysis.status === AnalysisStatus.Started) {
                this.stopAnalysis(this.currentAnalysis);
            }
        }
    }

    onCompleteBtnClick() {
        if (this.currentAnalysis && this.currentAnalysis.status === AnalysisStatus.Started) {
            this.completeAnalysis(this.currentAnalysis);
        }
    }
}
