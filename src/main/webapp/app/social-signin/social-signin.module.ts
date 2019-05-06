import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {
    SocialSignInOauthCallbackComponent,
    socialSignInState
} from './';

@NgModule({
    imports: [RouterModule.forChild(socialSignInState)],
    declarations: [SocialSignInOauthCallbackComponent]
})
export class BigtwineSocialSignInModule {}
