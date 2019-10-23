import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AnalysisState, IDatasetAnalysisInput, IDocument } from 'app/analysis';
import { BoundedAnalysisViewComponent } from 'app/analysis/components';

@Component({
  selector: 'btw-dataset-view',
  templateUrl: './dataset-view.component.html',
  styleUrls: ['./dataset-view.component.scss']
})
export class DatasetViewComponent extends BoundedAnalysisViewComponent {

    get datasetDocument(): IDocument {
        const docInput = (this.currentAnalysis.input as IDatasetAnalysisInput);
        return {
            documentId: docInput.documentId,
            filename: docInput.name,
            size: docInput.size
        };
    }

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected analysisStore: Store<AnalysisState>
    ) {
        super(router, route, analysisStore);
    }

    onCurrentAnalysisIdChange(analysisId: string) {
        super.onCurrentAnalysisIdChange(analysisId);
    }
}
