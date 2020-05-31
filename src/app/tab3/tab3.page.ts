import { Component } from '@angular/core';
import { EmsivozServiceService } from '../servicio/emsivoz-service.service';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  datHistory = [];
  constructor(public service: EmsivozServiceService, private router: Router, private androidPermissions: AndroidPermissions) {
    this.getCallHistory();
  }

  getCallHistory() {
    this.service.getHistoryCall().then(resp => {
      if (resp) {
        this.datHistory = resp.data.call_history;
      }
    });

  }
  aproximar(sale: number) {
    return Math.round(sale / 60);
  }

  checkCallPermission(contact: any) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
      status => {
        if (status.hasPermission) {
          this.llamarContacto(contact);
        } else {
          this.service.presentToast('Se deben aceptar permisos de audio para continuar');
          this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.RECORD_AUDIO,
            this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT
          ]).then(() => {
            this.llamarContacto(contact);
          });
        }
      }
    );
  }

  llamarContacto(contact: any) {

    const phoneNumber = contact.replace(/[^0-9+]/gi, '');
    this.router.navigate(['/home/tab2', phoneNumber]);

  }
}
