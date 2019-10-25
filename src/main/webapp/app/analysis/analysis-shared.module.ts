import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import { NgxUploadModule } from '@wkoza/ngx-upload';
import { BigtwineSharedModule } from 'app/shared';
import {
    AnalysisInputBadgeComponent,
    AnalysisListComponent,
    AnalysisSettingsComponent,
    AnalysisStatusBadgeComponent,
    AnalysisStatusHistoryComponent,
    AnalysisToolbarComponent,
    ResultsToolbarComponent,
    ResultsExportBtnComponent,
    ChoicesOptionComponent,
    NumberOptionComponent,
    TextOptionComponent,
    BooleanOptionComponent,
    OptionWrapperComponent,
    StepperComponent,
    QueryInputComponent,
    DocumentDetailsComponent,
    DocumentPickerComponent,
    DocumentLibraryComponent,
    DocumentUploaderComponent,
} from 'app/analysis/components';

@NgModule({
    imports: [
        CommonModule,
        BigtwineSharedModule,
        RouterModule,
        TagInputModule,
        NgxUploadModule.forRoot(),
    ],
    declarations: [
        AnalysisToolbarComponent,
        AnalysisStatusHistoryComponent,
        AnalysisSettingsComponent,
        AnalysisListComponent,
        ResultsToolbarComponent,
        ResultsExportBtnComponent,
        AnalysisStatusBadgeComponent,
        AnalysisInputBadgeComponent,
        ChoicesOptionComponent,
        NumberOptionComponent,
        TextOptionComponent,
        BooleanOptionComponent,
        OptionWrapperComponent,
        StepperComponent,
        QueryInputComponent,
        DocumentDetailsComponent,
        DocumentPickerComponent,
        DocumentLibraryComponent,
        DocumentUploaderComponent,
    ],
    exports: [
        AnalysisToolbarComponent,
        AnalysisStatusHistoryComponent,
        AnalysisSettingsComponent,
        AnalysisListComponent,
        ResultsToolbarComponent,
        AnalysisStatusBadgeComponent,
        AnalysisInputBadgeComponent,
        ChoicesOptionComponent,
        NumberOptionComponent,
        TextOptionComponent,
        BooleanOptionComponent,
        OptionWrapperComponent,
        StepperComponent,
        QueryInputComponent,
        DocumentDetailsComponent,
        DocumentPickerComponent,
        DocumentLibraryComponent,
        DocumentUploaderComponent,
    ],
    entryComponents: [
        AnalysisStatusHistoryComponent,
        AnalysisSettingsComponent,
    ],
})
export class AnalysisSharedModule {
    static forRoot() {
        return {
            ngModule: AnalysisSharedModule,
            providers: []
        };
    }
}
