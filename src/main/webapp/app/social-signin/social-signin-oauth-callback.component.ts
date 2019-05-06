import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from 'app/app.constants';
import {SocialSignInService} from 'app/social-signin/social-signin.service';

@Component({
    templateUrl: './social-signin-oauth-callback.component.html'
})
export class SocialSignInOauthCallbackComponent implements OnInit {
    constructor(private route: ActivatedRoute, private ssiService: SocialSignInService) { }

    ngOnInit(): void {
        const oauthVerifier = this.route.snapshot.queryParamMap.get('oauth_verifier');
        const oauthToken = this.route.snapshot.queryParamMap.get('oauth_token');
        const providerId = this.route.snapshot.paramMap.get('providerId');

        this.ssiService.completeSignInOAuth10Routine(providerId, oauthToken, oauthVerifier);
    }
}
