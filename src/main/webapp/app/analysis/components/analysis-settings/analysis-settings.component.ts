import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from 'app/analysis/services/user-settings.service';
import { AnalysisState, AnalysisStatus, IAnalysis, NumberOptionConfig, RestoreUserSettings, selectCurrentAnalysis } from 'app/analysis';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'btw-analysis-settings',
    templateUrl: './analysis-settings.component.html',
    styleUrls: ['./analysis-settings.component.scss']
})
export class AnalysisSettingsComponent implements OnInit {
    currentAnalysis$: Observable<IAnalysis>;

    get currentAnalysis(): IAnalysis {
        let currentAnalysis: IAnalysis = null;
        this.currentAnalysis$
            .pipe(take(1))
            .subscribe((analysis: IAnalysis) => currentAnalysis = analysis);

        return currentAnalysis;
    }

    constructor(public userSettings: UserSettingsService, private store: Store<AnalysisState>) {
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
    }

    ngOnInit(): void {
        this.currentAnalysis$ = this.store.pipe(select(selectCurrentAnalysis));
        this.store.dispatch(new RestoreUserSettings());
    }

    isOptionDisabled(groupKey: string, optionKey: string): boolean {
        return this.isOptionsGroupDisabled(groupKey);
    }

    isOptionsGroupDisabled(groupKey: string): boolean {
        return (groupKey === this.userSettings.ANALYSIS_OPTIONS_GROUP_KEY) &&
            this.currentAnalysis &&
            this.currentAnalysis.status !== AnalysisStatus.Ready;
    }
}
