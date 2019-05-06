export enum SocialSignInType {
    OAuth10 = 'oauth'
}

export interface ISocialSignInProvider {
    id: String;
    name: String;
    readonly type: SocialSignInType;
}

export class SocialSignInProvider implements ISocialSignInProvider {
    readonly id: String;
    readonly name: String;
    readonly type: SocialSignInType;

    constructor(id: String, name: String, type: SocialSignInType) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}
