import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AnalysisState } from 'app/analysis';
import { BoundedAnalysisViewComponent } from 'app/analysis/components';

@Component({
  selector: 'btw-dataset-view',
  templateUrl: './dataset-view.component.html',
  styleUrls: ['./dataset-view.component.scss']
})
export class DatasetViewComponent extends BoundedAnalysisViewComponent {

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected analysisStore: Store<AnalysisState>
    ) {
        super(router, route, analysisStore);
    }

}
