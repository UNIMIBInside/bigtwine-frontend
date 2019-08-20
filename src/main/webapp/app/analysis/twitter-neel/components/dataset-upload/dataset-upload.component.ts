import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DropTargetOptions, FileItem, HttpClientUploadService, InputFileOptions, MineTypeEnum } from '@wkoza/ngx-upload';
import { SERVER_API_URL } from 'app/app.constants';
import { AnalysisInputType, AnalysisState, AnalysisType, CreateAnalysis, IAnalysis, IDatasetAnalysisInput, selectCurrentAnalysis } from 'app/analysis';
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
export class DatasetUploadComponent extends AnalysisNewComponent implements OnInit, OnDestroy {
    @ViewChild('ourForm') ourForm;

    optionsInput: InputFileOptions = {
        multiple: false,
        accept: ['text/csv' as MineTypeEnum]
    };

    optionsDrop: DropTargetOptions = {
        color: 'dropZoneColorMaterial',
        colorDrag: 'dropZoneColorDragMaterial',
        colorDrop: 'dropZoneColorDropMaterial',
        multiple: false,
        accept: ['text/csv' as MineTypeEnum]
    };

    documentId: string;

    constructor(
        protected router: Router,
        protected analysisStore: Store<AnalysisState>,
        public uploader: HttpClientUploadService) {
        super(router, analysisStore);
    }

    ngOnInit() {
        super.ngOnInit();
        this.uploader.queue = [];

        this.uploader.onCancel$.subscribe(
            (data: FileItem) => {
                console.log('file canceled: ' + data.file.name);

            });

        this.uploader.onDropError$.subscribe(
            err => {
                console.log('error during drop action: ', err);
            });

        this.uploader.onProgress$.subscribe(
            (data: any) => {
                console.log('upload file in progree: ', data.progress);

            });

        this.uploader.onSuccess$.subscribe(
            (data: any) => {
                console.log('upload file successful:', data);
                this.documentId = data.body.documentId;
                this.createAnalysis();
            }
        );

        this.uploader.onAddToQueue$.subscribe(
            (item: FileItem) => {
                console.log(`reset of our form`);
                this.ourForm.reset();
                this.upload(item);
            }
        );
    }

    upload(item: FileItem) {
        item.upload({
            method: 'POST',
            url: `${SERVER_API_URL}analysis/api/public/documents`
        });
    }

    uploadAll() {
        this.uploader.uploadAll({
            method: 'POST',
            url: `${SERVER_API_URL}analysis/api/public/documents`
        });
    }

    makeThumbnail(item: FileItem) {
        const reader = new FileReader();
        // read the image file as a data URL.
        reader.readAsDataURL(item.file);

    }

    activeRemoveAllBtn(): boolean {
        return this.uploader.queue.some(item => (item.isReady || item.isCancel || item.isError));
    }

    activeUploadAllBtn(): boolean {
        return this.uploader.queue.some(item => (item.isReady));
    }

    activeCancelAllBtn(): boolean {
        return this.uploader.queue.some((item: FileItem) => item.uploadInProgress);
    }

    buildAnalysis() {
        if (!this.documentId) {
            return null;
        }

        const analysis: IAnalysis = {
            type: AnalysisType.TwitterNeel,
            input: {
                type: AnalysisInputType.Dataset,
                documentId: this.documentId
            } as IDatasetAnalysisInput,
        };

       return analysis;
    }
}
