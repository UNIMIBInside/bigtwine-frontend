import { Component, Input } from '@angular/core';
import {
    IStatusTextPart,
    TweetEntityHighlighterService,
    INeelProcessedTweet,
} from 'app/analysis/twitter-neel';

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
