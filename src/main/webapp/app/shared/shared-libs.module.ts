import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgJhipsterModule } from 'ng-jhipster';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CookieModule } from 'ngx-cookie';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
    imports: [
        NgbModule,
        InfiniteScrollModule,
        CookieModule.forRoot(),
        FontAwesomeModule,
        NgCircleProgressModule.forRoot({
            'backgroundPadding': 0,
            'radius': 16,
            'space': -2,
            'toFixed': 1,
            'maxPercent': 100,
            'outerStrokeWidth': 2,
            'outerStrokeColor': '#fff',
            'innerStrokeColor': 'rgba(232,232,232,0.1)',
            'innerStrokeWidth': 2,
            'titleFontSize': '12',
            'animation': false,
            'animateTitle': false,
            'animationDuration': 1000,
            'showTitle': false,
            'showUnits': false,
            'showBackground': false,
        }),
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgbModule,
        NgJhipsterModule,
        InfiniteScrollModule,
        FontAwesomeModule,
        NgCircleProgressModule,
    ]
})
export class BigtwineSharedLibsModule {
    static forRoot() {
        return {
            ngModule: BigtwineSharedLibsModule
        };
    }
}
