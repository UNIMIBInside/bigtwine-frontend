import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
    templateUrl: './twitter-neel-home.component.html',
    styleUrls: ['./twitter-neel-home.component.scss'],
    selector: 'btw-twitter-neel-home',
})
export class TwitterNeelHomeComponent implements OnInit, OnDestroy {

    private destroyed$ = new ReplaySubject<boolean>(1);

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
