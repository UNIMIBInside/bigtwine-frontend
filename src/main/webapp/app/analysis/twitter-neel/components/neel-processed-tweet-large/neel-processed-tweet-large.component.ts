import { Component, Input } from '@angular/core';
import { INeelProcessedTweet } from 'app/analysis/twitter-neel/models/neel-processed-tweet.model';

@Component({
    selector: 'btw-neel-processed-tweet-large',
    templateUrl: './neel-processed-tweet-large.component.html',
    styleUrls: ['./neel-processed-tweet-large.component.scss'],
})
export class NeelProcessedTweetLargeComponent {

    @Input() tweet: INeelProcessedTweet;

    constructor() { }
}
