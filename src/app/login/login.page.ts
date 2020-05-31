import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmsivozServiceService } from '../servicio/emsivoz-service.service';
import { NgForm } from '@angular/forms';
import { Register } from '../servicio/register';
import { Storage } from '@ionic/storage';
import { Login } from '../servicio/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginVar: Login;
  phoneValue: string;

  constructor(
    private router: Router,
    private services: EmsivozServiceService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.loginVar = new Login();
  }
  login(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.services.presentLoading('Cargando');
    this.phoneValue = this.loginVar.phone;
    const PhoneNumber = this.phoneValue.replace(/[^0-9]/gi, '');
    if(this.phoneValue === '') {
      this.services.presentToast('El número no puede estar vacio');
    }
    this.services.Login({ phone: PhoneNumber }).then(resp => {
      if (resp) {
        setTimeout(() => {
          this.services.cerrarload();
        }, 1500);
        this.router.navigate(['/validar-codigo', PhoneNumber], { replaceUrl: true });
      }
    })
      .catch(error => {
        setTimeout(() => {
          this.services.cerrarload();
        }, 1500);
        this.services.presentToast(error.response.data.error);
        if (error.response.data.error) {
          this.services.presentToast(error.response.data.error);
        }
      });
  }

  registrod() {
    this.router.navigate(['/registro'], { replaceUrl: true });
  }

  loginss() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
