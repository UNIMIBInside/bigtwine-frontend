import { Component } from '@angular/core';
import { AnalysisState, CreateAnalysis } from 'app/analysis/store';
import { AnalysisToolbarActionBtnType, StreamAnalysisViewComponent } from 'app/analysis/components';
import { AnalysisInputType, AnalysisType, IAnalysis, IQueryAnalysisInput } from 'app/analysis';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AccountService } from 'app/core';

@Component({
  selector: 'btw-query-view',
  templateUrl: './query-view.component.html',
  styleUrls: ['./query-view.component.scss']
})
export class QueryViewComponent extends StreamAnalysisViewComponent {

    query: any;

    get currentAnalysisQuery(): IQueryAnalysisInput {
        return this.currentAnalysis ? this.currentAnalysis.input as IQueryAnalysisInput : null;
    }

    get showCreateBtn(): boolean {
        if (this.accountService.hasAnyAuthority(['ROLE_DEMO'])) {
            return false;
        }

        return this.query && this.currentAnalysis && JSON.stringify(this.query) !== JSON.stringify(this.currentAnalysis.input);
    }

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected analysisStore: Store<AnalysisState>,
        protected accountService: AccountService) {
        super(router, route, analysisStore, accountService);
    }

    onToolbarActionBtnClick(btn: AnalysisToolbarActionBtnType) {
        if (btn === AnalysisToolbarActionBtnType.Create) {
            this.createAnalysis();
        }
    }

    onCurrentAnalysisIdChange(analysisId: string) {
        super.onCurrentAnalysisIdChange(analysisId);
    }

    createAnalysis() {
        if (this.query) {
            const analysis: IAnalysis = {
                type: AnalysisType.TwitterNeel,
                input: {
                    type: AnalysisInputType.Query,
                    ...this.query
                }
            };

            this.analysisStore.dispatch(new CreateAnalysis(analysis));
        }
    }
}
