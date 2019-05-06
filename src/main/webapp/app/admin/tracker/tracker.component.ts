import { Component, OnInit, OnDestroy } from '@angular/core';

import { BtwTrackerService } from 'app/core';

@Component({
    selector: 'btw-tracker',
    templateUrl: './tracker.component.html'
})
export class BtwTrackerComponent implements OnInit, OnDestroy {
    activities: any[] = [];

    constructor(private trackerService: BtwTrackerService) {}

    showActivity(activity: any) {
        let existingActivity = false;
        for (let index = 0; index < this.activities.length; index++) {
            if (this.activities[index].sessionId === activity.sessionId) {
                existingActivity = true;
                if (activity.page === 'logout') {
                    this.activities.splice(index, 1);
                } else {
                    this.activities[index] = activity;
                }
            }
        }
        if (!existingActivity && activity.page !== 'logout') {
            this.activities.push(activity);
        }
    }

    ngOnInit() {
        this.trackerService.subscribe();
        this.trackerService.receive().subscribe(activity => {
            this.showActivity(activity);
        });
    }

    ngOnDestroy() {
        this.trackerService.unsubscribe();
    }
}
