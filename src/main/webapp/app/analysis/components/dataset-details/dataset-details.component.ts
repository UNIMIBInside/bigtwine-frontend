import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AnalysisState, GetDocumentMeta, IDocument, selectDocumentById } from 'app/analysis';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'btw-dataset-details',
    templateUrl: './dataset-details.component.html',
    styleUrls: ['./dataset-details.component.scss']
})
export class DatasetDetailsComponent implements OnInit, OnDestroy {
    protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    private _documentId: string;

    get documentId(): string {
        return this._documentId;
    }

    @Input() set documentId(docId: string) {
        this._documentId = docId;
        if (docId != null) {
            this.store
                .select(selectDocumentById(this.documentId))
                .pipe(takeUntil(this.destroyed$))
                .subscribe(doc => {
                    if (!doc) {
                        this.store.dispatch(new GetDocumentMeta(this.documentId));
                    } else {
                        this.document = doc;
                    }
                });
        }
    }

    document: IDocument;

    constructor(private store: Store<AnalysisState>) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    humanFileSize(size: number) {
        const i = Math.floor( Math.log(size) / Math.log(1024) );
        return (+(size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }
}
