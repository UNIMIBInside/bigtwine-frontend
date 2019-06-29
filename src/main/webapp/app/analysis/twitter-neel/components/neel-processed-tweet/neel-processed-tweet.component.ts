import { Component, Input } from '@angular/core';
import { INeelProcessedTweet } from 'app/analysis/twitter-neel/models/neel-processed-tweet.model';

@Component({
    selector: 'btw-neel-processed-tweet',
    templateUrl: './neel-processed-tweet.component.html',
    styleUrls: ['./neel-processed-tweet.component.scss'],
})
export class NeelProcessedTweetComponent {

    @Input() tweet: INeelProcessedTweet;

    constructor() { }
}
