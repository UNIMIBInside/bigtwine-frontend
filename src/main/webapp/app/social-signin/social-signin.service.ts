import {Injectable} from '@angular/core';
import {Location} from '@angular/common';

import {AuthServerProvider} from '../core/auth/auth-jwt.service';
import {ISocialSignInProvider, SocialSignInProvider, SocialSignInType} from 'app/social-signin/social-signin-provider.model';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from 'app/app.constants';
import {AccountService, WindowRef} from 'app/core';

export const SOCIAL_SIGNIN_PROVIDERS: ISocialSignInProvider[] = [
    new SocialSignInProvider('twitter', 'Twitter', SocialSignInType.OAuth10),
];

@Injectable({ providedIn: 'root' })
export class SocialSignInService {

    constructor(
        private authServerProvider: AuthServerProvider,
        private accountService: AccountService,
        private http: HttpClient,
        private $window: WindowRef) {}

    get signInProviders(): ISocialSignInProvider[] {
        return SOCIAL_SIGNIN_PROVIDERS;
    }

    startSignInRoutine(provider: ISocialSignInProvider): Promise<any> {
        if (provider.type === SocialSignInType.OAuth10) {
            return this.startSignInOAuth10Routine(provider);
        }

        throw new Error('Unimplemented provider type: ' + provider.type);
    }

    async startSignInOAuth10Routine(provider: ISocialSignInProvider): Promise<any> {
        const callbackUrl = `${location.protocol}//${location.host}/social-signin/oauth-callback/${provider.id}`;
        const data = {
            callbackUrl
        };
        const response: any = await this.http.post(`${SERVER_API_URL}socials/api/oauth/authorize/${provider.id}`, data).toPromise();

        this.$window.nativeWindow.open(response.authorizedUrl, 'Social Sign In', 'width=640,height=480,scrollbars=no');

        return response;
    }

    async completeSignInOAuth10Routine(providerId: String, oauthToken: String, oauthVerifier: String): Promise<any> {
        const data = {
            allowImplicitSignUp: true,
            requestToken: oauthToken,
            verifier: oauthVerifier
        };
        const action = this.accountService.isAuthenticated() ? 'connect' : 'signin';

        const response: any = await this.http.post(`${SERVER_API_URL}socials/api/oauth/${action}/${providerId}`, data).toPromise();

        await this.authServerProvider.loginWithToken(response.idToken, true);
        if (this.$window.nativeWindow.opener) {
            this.$window.nativeWindow.opener.location.reload(true);
            this.$window.nativeWindow.close();
        }

        return response;
    }
}
