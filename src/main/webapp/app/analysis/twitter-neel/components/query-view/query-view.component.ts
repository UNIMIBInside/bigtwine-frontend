import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AnalysisState, CreateAnalysis } from 'app/analysis/store';
import { AnalysisToolbarActionBtnType, StreamAnalysisViewComponent } from 'app/analysis/components';
import { AnalysisInputType, AnalysisType, IAnalysis, IQueryAnalysisInput } from 'app/analysis';
import { UserSettingsService } from 'app/analysis/services/user-settings.service';
import { STREAM_ANALYSIS_OPTIONS } from 'app/analysis/twitter-neel/configs';

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
        return this.query && this.currentAnalysis && JSON.stringify(this.query) !== JSON.stringify(this.currentAnalysis.input);
    }

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected analysisStore: Store<AnalysisState>,
        protected userSettings: UserSettingsService
    ) {
        super(router, route, analysisStore, userSettings);
    }

    onToolbarActionBtnClick(btn: AnalysisToolbarActionBtnType) {
        if (btn === AnalysisToolbarActionBtnType.Create) {
            this.createAnalysis();
        }
    }

    onCurrentAnalysisIdChange(analysisId: string) {
        super.onCurrentAnalysisIdChange(analysisId);

        if (analysisId) {
            this.userSettings.registerAnalysisOptions(STREAM_ANALYSIS_OPTIONS, this.currentAnalysis.userSettings);
        }
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
