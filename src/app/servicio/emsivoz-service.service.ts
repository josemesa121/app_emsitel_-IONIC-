import { Injectable } from '@angular/core';
import axios from 'axios';
import { Register } from './register';
import { environment } from '../../environments/environment';
import { UsuarioModel } from './UsuarioModel';
import { Storage } from '@ionic/storage';
import { Login } from './login';
import { Password, ChangePass, User } from './localcodesms';
import { ToastController, Platform, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class EmsivozServiceService {
  dat: any;
  userToken: any;
  private isLoggedIn = false;
  token: any;

  constructor(private storage: Storage, 
              private toastController: ToastController, 
              plt: Platform,
              public loadingController: LoadingController) {

  }

  registro(usuario: UsuarioModel) {
    const authuser = {
      ...usuario,
    };
    return axios.post(environment.API_URL + '/api/auth/register', authuser);
  }
  validarsms(registro: Register) {
    const validarsms = {
      ...registro,
    };
    return axios.post(environment.API_URL + '/api/auth/loginCodeSms', validarsms);
  }
  async getProfile() {
    const dat = await this.storage.get('data');
    const config = { headers: { Authorization: `Bearer ${dat.token}` } };
    return axios.get(environment.API_URL + '/api/auth/profile', config);
  }
  Login(registro: Login) {
    const validarsms = {
      ...registro,
    };
    return axios.post(environment.API_URL + '/api/auth/login', validarsms);
  }
  olvidoContrasena(email: Password) {
    return axios.post(environment.API_URL + '/api/auth/sendTokenPasswordReset', email);
  }
  changePassword(cambio: ChangePass) {
    const data = {
      ...cambio,
    };
    return axios.post(environment.API_URL + '/api/auth/passwordReset', data);
  }
  async getHistoryCall() {
    const dat = await this.storage.get('data');
    const config = { headers: { Authorization: `Bearer ${dat.token}` } };
    return axios.get(environment.API_URL + '/api/user/sip/call/history', config);
  }

  logout() {
    this.storage.remove('data');
    this.storage.remove('emsitoken');
  }

  async getcheckCredit() {
    const dat = await this.storage.get('data');
    const config = { headers: { Authorization: `Bearer ${dat.token}` } };
    return axios.get(environment.API_URL + '/api/user/sip/checkCredit', config);
  }
  async updateProfile(usuario: User) {
    const authuser = {
      ...usuario,
    };
    const dat = await this.storage.get('data');
    const config = { headers: { Authorization: `Bearer ${dat.token}` } };
    if (config) {
      return axios.post(environment.API_URL + '/api/auth/updateProfile', authuser, config);
    }
  }
  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    toast.present();
  }
  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
    });
    await loading.present();
  }
  cerrarload() {
    this.loadingController.dismiss();
  }
}
