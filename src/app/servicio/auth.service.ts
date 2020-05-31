import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private userToken;

    constructor(private storage: Storage) {
        this.loadToken();
    }

    async loadToken() {
        this.userToken = await this.storage.get('emsitoken');
    }

    async assignToken(data) {
        this.userToken = await this.storage.set('emsitoken', data);
        return this.getToken();
    }

    getToken() {
        return this.userToken;
    }

     async isAuthenticated() {
        await this.loadToken();
        return !!this.userToken;
    }

}