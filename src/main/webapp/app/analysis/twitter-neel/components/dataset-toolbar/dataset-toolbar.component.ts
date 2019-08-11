import { Component, OnInit } from '@angular/core';
import { AnalysisToolbarComponent } from 'app/analysis/components/analysis-toolbar.component';

@Component({
  selector: 'btw-dataset-toolbar',
  templateUrl: './dataset-toolbar.component.html',
  styleUrls: ['./dataset-toolbar.component.scss']
})
export class DatasetToolbarComponent extends AnalysisToolbarComponent implements OnInit {

  constructor() {
      super();
  }

  ngOnInit() {
  }

}
