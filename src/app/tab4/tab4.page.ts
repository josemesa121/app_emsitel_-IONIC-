import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { EmsivozServiceService } from '../servicio/emsivoz-service.service';
import { User } from '../servicio/localcodesms';
import { UsuarioModel } from '../servicio/UsuarioModel';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  datUsuarios = {} as User;
  datCredit: string;
  usuario: UsuarioModel;
  constructor(private router: Router, private storage: Storage, private servicio: EmsivozServiceService) {
    this.datUsuarios = new User();
    this.getProfile();
  }

  ngOnInit() {

  }

  getProfile() {
    this.servicio.getProfile().then(profile => {
      this.datUsuarios = profile.data.user;
      this.servicio.getcheckCredit().then(credit => {
        this.datCredit = credit.data.credit;
      }).catch(error => {
        if (error.response.data.errors.email) {
          this.servicio.presentToast(error.response.data.errors.email);
        }
      });
    }).catch(error => {
      if (error.response.data.message) {
        this.servicio.presentToast(error.response.data.message);
      }
    });
  }
  logout() {
    this.servicio.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  getupProfile() {
    this.servicio.updateProfile(this.datUsuarios).then(conta => {
      if (conta) {
        this.servicio.presentToast('Actualización de Datos Exitosa');
      }
    }).catch(error => {
      if (error.response.data.errors) {
        this.servicio.presentToast(error.response.data.errors.email);
      }
    });
  }
}
