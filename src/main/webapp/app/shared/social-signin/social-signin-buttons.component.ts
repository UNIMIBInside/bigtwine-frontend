import {AfterViewInit, Component} from '@angular/core';
import {SocialSignInService} from 'app/social-signin/social-signin.service';
import {ISocialSignInProvider} from 'app/social-signin/social-signin-provider.model';

@Component({
    selector: 'btw-social-signin-buttons',
    templateUrl: './social-signin-buttons.component.html',
    styleUrls: ['social-signin-buttons.scss']
})
export class SocialSignInButtonsComponent implements AfterViewInit {
    constructor(private ssiService: SocialSignInService) {

    }

    ngAfterViewInit(): void {
        console.log(this.ssiService);
    }

    get providers(): ISocialSignInProvider[] {
        return this.ssiService.signInProviders;
    }

    signIn(provider: ISocialSignInProvider) {
        this.ssiService.startSignInRoutine(provider);
    }
}
