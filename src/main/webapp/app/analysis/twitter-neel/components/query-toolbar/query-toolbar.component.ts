import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'btw-query-toolbar',
  templateUrl: './query-toolbar.component.html',
  styleUrls: ['./query-toolbar.component.scss']
})
export class QueryToolbarComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  switchViewMode(mode) {
    this.router.navigate([{'outlets': {'results-viewer': mode}}], {relativeTo: this.route});
  }

}
