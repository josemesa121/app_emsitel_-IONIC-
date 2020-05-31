import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, FormControl } from '@angular/forms';
import { UsuarioModel } from '../servicio/UsuarioModel';
import { EmsivozServiceService } from '../servicio/emsivoz-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
   usuario: UsuarioModel;
  myForm: FormGroup;
  phoneValue: any;
  
  constructor(private services: EmsivozServiceService, private router: Router,  public fb: FormBuilder) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    this.validarform();
  }
  registro(form) {
      console.log(form);
      if (form.invalid) { return; }
      this.phoneValue = this.usuario.phone;
      this.services.presentLoading('Validando Registro');
      const PhoneNumber = this.phoneValue.replace(/[^0-9]/gi, '');
      this.services.registro( {name: this.usuario.name, email: this.usuario.email, phone: PhoneNumber} ).then( resp => {
        if (resp) {
          setTimeout(() => {
            this.services.cerrarload();
          }, 1500);
          this.router.navigate(['/validar-codigo', PhoneNumber], { replaceUrl: true });
        }
      }).catch(error => {
          console.log(error.response.data.errors);
          setTimeout(() => {
            console.log(error.response.data.errors);
            this.services.cerrarload();
          }, 1500);
          if (error.response.data.errors.email) {
          this.services.presentToast(error.response.data.errors.email);
          }
          if (error.response.data.errors.phone) {
            this.services.presentToast(error.response.data.errors.phone);
          }
      });
      }
      validarform() {
        this.myForm = new FormGroup({
          name: new FormControl ('', [Validators.required]),
          phone: new FormControl ('', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]),
          email: new FormControl ('', [Validators.required, Validators.email]),
        });
      }

}
