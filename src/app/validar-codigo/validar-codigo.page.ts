import { Component, OnInit } from '@angular/core';
import { EmsivozServiceService } from '../servicio/emsivoz-service.service';
import { NgForm } from '@angular/forms';
import { Register } from '../servicio/register';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../servicio/auth.service';

@Component({
  selector: 'app-validar-codigo',
  templateUrl: './validar-codigo.page.html',
  styleUrls: ['./validar-codigo.page.scss']
})
export class ValidarCodigoPage implements OnInit {
  registro: Register;
  argumento;
  constructor(
    private servicios: EmsivozServiceService,
    private auth: AuthService,
    private storage: Storage,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.registro = new Register();
    this.argumento = this.activatedRoute.snapshot.paramMap.get('phone');
    this.registro.phone = this.argumento;
    
  }
  valdarsms(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.servicios.presentLoading('Validando Codigo!.');
    this.servicios.validarsms(this.registro).then(resp => {
      if (resp) {
        setTimeout(() => {
          this.servicios.cerrarload();
        }, 1500);
        this.storage.set('data', resp.data).then(data => {
          if (data) {
          }
        });

        const token = this.auth.assignToken(resp.data.token);
        if (token) {
          this.router.navigate(['/home'], { replaceUrl: true });
        }

      }
    }).catch(error => {
      setTimeout(() => {
        this.servicios.cerrarload();
      }, 1500);
      if (error.response.data.errors.code) {
        this.servicios.presentToast(error.response.data.errors.code);
      }
    });
  }
  loginss() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
