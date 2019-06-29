import { Component, Input } from '@angular/core';
import { INeelProcessedTweet } from 'app/analysis/twitter-neel/models/neel-processed-tweet.model';
import { IStatusTextPart, TweetEntityHighlighterService } from 'app/analysis/twitter-neel/service/tweet-entity-highlighter.service';

@Component({
    selector: 'btw-highlighted-tweet-text',
    templateUrl: './highlighted-tweet-text.component.html',
    styleUrls: ['./highlighted-tweet-text.component.scss'],
})
export class HighlightedTweetTextComponent {
    @Input() tweet: INeelProcessedTweet;

    constructor(private highlighter: TweetEntityHighlighterService) {}

    getTextParts(): IStatusTextPart[] {
        return this.highlighter.getTextParts(this.tweet);
    }
}
