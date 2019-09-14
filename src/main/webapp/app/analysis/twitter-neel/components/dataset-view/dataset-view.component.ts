import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AnalysisState, IDatasetAnalysisInput } from 'app/analysis';
import { BoundedAnalysisViewComponent } from 'app/analysis/components';
import { UserSettingsService } from 'app/analysis/services/user-settings.service';
import { DATASET_ANALYSIS_OPTIONS } from 'app/analysis/twitter-neel/configs';

@Component({
  selector: 'btw-dataset-view',
  templateUrl: './dataset-view.component.html',
  styleUrls: ['./dataset-view.component.scss']
})
export class DatasetViewComponent extends BoundedAnalysisViewComponent {

    get datasetDocumentId(): string {
        return (this.currentAnalysis.input as IDatasetAnalysisInput).documentId;
    }

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected analysisStore: Store<AnalysisState>,
        protected userSettings: UserSettingsService
    ) {
        super(router, route, analysisStore, userSettings);
    }

    onCurrentAnalysisIdChange(analysisId: string) {
        super.onCurrentAnalysisIdChange(analysisId);

        if (analysisId) {
            this.userSettings.registerAnalysisOptions(DATASET_ANALYSIS_OPTIONS, this.currentAnalysis.settings);
        }
    }
}
