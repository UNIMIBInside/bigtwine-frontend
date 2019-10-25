import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DropTargetOptions, FileItem, HttpClientUploadService, InputFileOptions, MineTypeEnum } from '@wkoza/ngx-upload';
import { SERVER_API_URL } from 'app/app.constants';
import { AnalysisInputType, AnalysisState, AnalysisType, CreateAnalysis, IAnalysis, IDatasetAnalysisInput, IDocument, selectCurrentAnalysis } from 'app/analysis';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AnalysisNewComponent } from 'app/analysis/components/analysis-new.component';

@Component({
  selector: 'btw-dataset-upload',
  templateUrl: './dataset-upload.component.html',
  styleUrls: ['./dataset-upload.component.scss']
})
export class DatasetUploadComponent extends AnalysisNewComponent {
    document: IDocument;

    constructor(
        protected router: Router,
        protected analysisStore: Store<AnalysisState>) {
        super(router, analysisStore);
    }

    buildAnalysis() {
        if (!this.document.id) {
            return null;
        }

        const analysis: IAnalysis = {
            type: AnalysisType.TwitterNeel,
            input: {
                type: AnalysisInputType.Dataset,
                documentId: this.document.id
            } as IDatasetAnalysisInput,
        };

       return analysis;
    }

    onDocumentSelection(document: IDocument) {
        this.document = document;
        if (this.document) {
            this.createAnalysis();
        }
    }
}
