import {Component, OnInit} from '@angular/core';
import {ResultsViewerComponent} from 'app/analysis/twitter-neel/components/results-viewer.component';

@Component({
    templateUrl: './map-results-viewer.component.html',
    styleUrls: ['./map-results-viewer.component.scss']
})
export class MapResultsViewerComponent extends ResultsViewerComponent implements OnInit {

    public lat = 10;
    public lng = 10;
    public zoom = 3;
    public markers: Marker[] = [];

    mapClicked(e) {}
    clickedMarker(m, i) {}
    markerDragEnd(m, e) {}

    ngOnInit(): void {
        for (let i = 0; i < 1000; ++i) {
            this.markers.push(
                {
                    label: 'prova' + i,
                    lat: 10 + (Math.random()),
                    lng: 10 + (Math.random()),
                    draggable: false
                }
            );
        }
    }

}

interface Marker {
    label: String;
    lat: number;
    lng: number;
    draggable: boolean;
}
