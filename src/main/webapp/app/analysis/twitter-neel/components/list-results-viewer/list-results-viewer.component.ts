import { Component, OnInit } from '@angular/core';
import {ResultsViewerComponent} from 'app/analysis/twitter-neel/components/results-viewer.component';

@Component({
  selector: 'btw-list-results-viewer',
  templateUrl: './list-results-viewer.component.html',
  styleUrls: ['./list-results-viewer.component.scss']
})
export class ListResultsViewerComponent extends ResultsViewerComponent implements OnInit {

  constructor() {
      super();
  }

  ngOnInit() {
  }

}
