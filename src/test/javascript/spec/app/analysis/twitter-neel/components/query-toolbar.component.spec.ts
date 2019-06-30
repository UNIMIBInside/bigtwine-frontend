import { BigtwineTestModule } from '../../../../test.module';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { QueryToolbarComponent } from 'app/analysis/twitter-neel/components';
import * as fromAnalysis from 'app/analysis/store';
import * as fromTwitterNeel from 'app/analysis/twitter-neel/store';
import { BigtwineSharedLibsModule } from 'app/shared';
import { of } from 'rxjs';
import { IAnalysis } from 'app/analysis';
import { EffectsModule } from '@ngrx/effects';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AnalysisService } from 'app/analysis/services/analysis.service';

describe('QueryToolbar Component', () => {
    let component: QueryToolbarComponent;
    let fixture: ComponentFixture<QueryToolbarComponent>;
    let store: Store<fromTwitterNeel.TwitterNeelState>;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BigtwineTestModule,
                BigtwineSharedLibsModule,
                StoreModule.forRoot({}),
                StoreModule.forFeature('analysis', fromAnalysis.AnalysisReducer),
                StoreModule.forFeature('twitterNeel', fromTwitterNeel.TwitterNeelReducer),
                EffectsModule.forRoot([]),
                EffectsModule.forFeature([fromAnalysis.AnalysisEffects, fromTwitterNeel.TwitterNeelEffects]),
            ],
            declarations: [
                QueryToolbarComponent,
            ],
            providers: [],
        });

        router = TestBed.get(Router);
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
        // spyOn(router, 'navigate').and.callThrough();

        fixture = TestBed.createComponent(QueryToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch an action to create analysis', (() => {
        const query = 'test';
        const action = new fromAnalysis.CreateAnalysis({
            type: 'twitter-neel',
            inputType: 'query',
            query,
        });

        component.createAnalysis(query);

        expect(store.dispatch).toHaveBeenCalledWith(action);
    }));

    it('should update current analysis', inject(
        [AnalysisService],
        fakeAsync((service: AnalysisService) => {
            const query = 'test';
            spyOn(service, 'createAnalysis').and.returnValue(of({
                id: 'testanalysis1',
                type: 'twitter-neel',
                inputType: 'query',
                query,
            }));

            component.createAnalysis(query);

            component.currentAnalysis$.subscribe((currentAnalysis: IAnalysis) => {
                expect(currentAnalysis).not.toBeNull();
                expect(currentAnalysis.id).toBe('testanalysis1');
            });

            expect(router.navigate).toHaveBeenCalledTimes(1);
        })
    ));

    it('should submit on button click', () => {
        const query = 'test';
        const action = new fromAnalysis.CreateAnalysis({
            type: 'twitter-neel',
            inputType: 'query',
            query,
        });

        const input = fixture.debugElement.query(By.css('input[name="query"]')).nativeElement as HTMLInputElement;
        const button = fixture.debugElement.query(By.css('button[name="submit"]')).nativeElement as HTMLButtonElement;

        input.value = query;
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        button.dispatchEvent(new Event('click'));

        expect(store.dispatch).toHaveBeenCalledWith(action);
    });
});
