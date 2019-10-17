import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import { BigtwineSharedModule } from 'app/shared';
import {
    AnalysisInputBadgeComponent,
    AnalysisListComponent,
    AnalysisSettingsComponent,
    AnalysisStatusBadgeComponent,
    AnalysisStatusHistoryComponent,
    AnalysisToolbarComponent,
    ResultsToolbarComponent,
    ChoicesOptionComponent,
    NumberOptionComponent,
    TextOptionComponent,
    BooleanOptionComponent,
    OptionWrapperComponent,
    StepperComponent,
    QueryInputComponent,
    DatasetDetailsComponent,
} from 'app/analysis/components';

@NgModule({
    imports: [
        CommonModule,
        BigtwineSharedModule,
        RouterModule,
        TagInputModule,
    ],
    declarations: [
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
        DatasetDetailsComponent,
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
        DatasetDetailsComponent,
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
