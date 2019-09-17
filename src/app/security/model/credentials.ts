export class Credentials {

    public username = '';
    public password = '';
    public grantType = 'password';

    constructor(username?: string, password?: string) {
        this.username = username;
        this.password = password;
    }

}
