import { Component } from '@angular/core';
import { UserSettingsService } from 'app/analysis/services/user-settings.service';
import { AnalysisState, NumberOptionConfig, RestoreUserSettings } from 'app/analysis';
import { Store } from '@ngrx/store';

@Component({
    selector: 'btw-analysis-settings',
    templateUrl: './analysis-settings.component.html',
    styleUrls: ['./analysis-settings.component.scss']
})
export class AnalysisSettingsComponent {

    constructor(private userSettings: UserSettingsService, private store: Store<AnalysisState>) {
        this.userSettings.registerGlobalOptions([
            new NumberOptionConfig(
                'pageSize',
                100,
                'Items per page',
                'number of items per page',
                100,
                2000,
                100
            )
        ]);

        this.store.dispatch(new RestoreUserSettings());
    }

}
