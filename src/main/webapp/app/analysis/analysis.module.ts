import { NgModule } from '@angular/core';
import { BigtwineSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';

import { analysisState } from './';

@NgModule({
    imports: [BigtwineSharedModule, RouterModule.forChild(analysisState)],
    declarations: [],
})
export class BigtwineAnalysisModule { }
