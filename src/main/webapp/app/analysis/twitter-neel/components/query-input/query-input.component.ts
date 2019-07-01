import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'btw-query-input',
    templateUrl: './query-input.component.html'
})
export class QueryInputComponent implements OnInit {
    @Output() queryChange = new EventEmitter<string>();
    @Input() set query(query: string) {
        if (this._query !== query) {
            this._query = query || '';
            this.parseQuery(query);
        }
    }
    _query = '';
    tokens = [];
    joiner: string;

    constructor() {}

    ngOnInit(): void {
    }

    onTagsChanged() {
        this._query = this.tokens.join(this.joiner);
        this.queryChange.emit(this._query);
    }

    parseQuery(query: string) {
        if (!query) {
            this.tokens = [];
            this.joiner = ' ';
        } else {
            if (query.indexOf(',') >= 0) {
                this.tokens = query.split(/,+/g);
                this.joiner = ',';
            } else {
                this.tokens = query.split(/\s+/g);
                this.joiner = ' ';
            }
        }
    }
}
