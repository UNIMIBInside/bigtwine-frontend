import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import {
    BigtwineSharedLibsModule,
    BigtwineSharedCommonModule,
    BtwLoginModalComponent,
    HasAnyAuthorityDirective,
    SocialSignInButtonsComponent,
    NumeralPipe,
} from './';

@NgModule({
    imports: [BigtwineSharedLibsModule, BigtwineSharedCommonModule],
    declarations: [BtwLoginModalComponent, HasAnyAuthorityDirective, SocialSignInButtonsComponent, NumeralPipe],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    entryComponents: [BtwLoginModalComponent],
    exports: [BigtwineSharedCommonModule, BtwLoginModalComponent, HasAnyAuthorityDirective, SocialSignInButtonsComponent, NumeralPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BigtwineSharedModule {
    static forRoot() {
        return {
            ngModule: BigtwineSharedModule
        };
    }
}
