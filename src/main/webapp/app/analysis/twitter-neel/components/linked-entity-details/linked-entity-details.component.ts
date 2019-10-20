import { Component, Input, OnInit } from '@angular/core';
import { ICoordinates, ILinkedEntity, INeelProcessedTweet, IResource } from 'app/analysis/twitter-neel';
import { ALT_MAP_STYLES, ALT_MAP_BG } from 'app/shared/gmap-styles';

@Component({
    selector: 'btw-linked-entity-details',
    templateUrl: './linked-entity-details.component.html',
    styleUrls: ['./linked-entity-details.component.scss']
})
export class LinkedEntityDetailsComponent implements OnInit {

    mapStyles = ALT_MAP_STYLES;
    mapBg = ALT_MAP_BG;

    @Input() entity: ILinkedEntity;
    @Input() parentTweet: INeelProcessedTweet;

    get resource(): IResource {
        return this.entity.resource;
    }

    get shouldShowMap(): boolean {
        return this.shouldShowResourceMapMarker || this.shouldShowStatusMapMarker || this.shouldShowTwitterUserMapMarker;
    }

    get shouldShowResourceMapMarker(): boolean {
        return !!(this.resource && this.resource.coordinates);
    }

    get shouldShowStatusMapMarker(): boolean {
        return !!(this.parentTweet &&
            this.parentTweet.status &&
            this.parentTweet.status.coordinates);
    }

    get shouldShowTwitterUserMapMarker(): boolean {
        return !!(this.parentTweet &&
            this.parentTweet.status &&
            this.parentTweet.status.user &&
            this.parentTweet.status.user.coordinates);
    }

    get mapCenterCoordinates(): ICoordinates {
        const coordinates: ICoordinates[] = [];

        if (this.shouldShowResourceMapMarker) {
            coordinates.push(this.resource.coordinates);
        }

        if (this.shouldShowStatusMapMarker) {
            coordinates.push(this.parentTweet.status.coordinates);
        }

        if (this.shouldShowTwitterUserMapMarker) {
            coordinates.push(this.parentTweet.status.user.coordinates);
        }

        if (coordinates.length === 0) {
            return {latitude: 0, longitude: 0};
        }

        const lat = coordinates.reduce((sum, coords) => sum + coords.latitude, 0) / coordinates.length;
        const lng = coordinates.reduce((sum, coords) => sum + coords.longitude, 0) / coordinates.length;

        return {latitude: lat, longitude: lng};
    }

    constructor() { }

    ngOnInit() {
    }
}