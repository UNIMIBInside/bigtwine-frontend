import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';
import { BigtwineSharedModule } from 'app/shared';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

import {
    adminState,
    AuditsComponent,
    UserMgmtComponent,
    UserMgmtDetailComponent,
    UserMgmtUpdateComponent,
    UserMgmtDeleteDialogComponent,
    LogsComponent,
    BtwMetricsMonitoringModalComponent,
    BtwMetricsMonitoringComponent,
    BtwHealthModalComponent,
    BtwHealthCheckComponent,
    BtwConfigurationComponent,
    BtwDocsComponent,
    BtwTrackerComponent
} from './';

@NgModule({
    imports: [
        BigtwineSharedModule,
        RouterModule.forChild(adminState)
        /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    ],
    declarations: [
        AuditsComponent,
        UserMgmtComponent,
        UserMgmtDetailComponent,
        UserMgmtUpdateComponent,
        UserMgmtDeleteDialogComponent,
        LogsComponent,
        BtwConfigurationComponent,
        BtwHealthCheckComponent,
        BtwHealthModalComponent,
        BtwDocsComponent,
        BtwTrackerComponent,
        BtwMetricsMonitoringComponent,
        BtwMetricsMonitoringModalComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    entryComponents: [UserMgmtDeleteDialogComponent, BtwHealthModalComponent, BtwMetricsMonitoringModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BigtwineAdminModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
