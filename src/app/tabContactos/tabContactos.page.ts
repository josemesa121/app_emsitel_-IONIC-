import { Component, OnInit } from '@angular/core';
import { Contacts, Contact, ContactFieldType, ContactName, IContactFindOptions } from '@ionic-native/contacts/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { EmsivozServiceService } from '../servicio/emsivoz-service.service';
@Component({
  selector: 'app-tab-contactos',
  templateUrl: 'tabContactos.page.html',
  styleUrls: ['tabContactos.page.scss']
})
export class TabContactosPage implements OnInit {
  ourtype: ContactFieldType[] = ['displayName'];
  contactsFound = [];
  myContacts: Contact[];
  phoneNumber: string;
  newNumber: string;
  constructor(
    // tslint:disable-next-line: deprecation
    private contacts: Contacts,
    private androidPermissions: AndroidPermissions,
    public plt: Platform,
    public router: Router,
    public service: EmsivozServiceService
  ) {
  }

  ngOnInit() {

    if (this.plt.is('cordova')) {
      this.loadContacts();
      // this.buscarcontacto('');
    }
  }

  loadContacts() {

    if (this.plt.is('cordova')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_CONTACTS).then(
        result => {
          const options = {
            filter: '',
            multiple: true,
            hasPhoneNumber: true
          };
          this.contacts.find(['*'], options).then((contacts: Contact[]) => {
            this.myContacts = contacts;
          });
        },
        err => {
          this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.READ_CONTACTS,
          ]
          ).then(() => {
            this.loadContacts();
          });
        }
      );
    }
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
    this.phoneNumber = contact.replace(/[^0-9+]/gi, '');
    if (this.phoneNumber.includes('+57')) {
      this.phoneNumber = contact.replace('+57', '');
      this.router.navigate(['/home/tab2', this.phoneNumber]);
    } else {
      if (this.phoneNumber.includes('037')) {
        this.phoneNumber = contact.replace('037', '');
        this.router.navigate(['/home/tab2', this.phoneNumber]);
      } else {
        this.phoneNumber = contact.replace(/[^0-9+]/gi, '');
        this.router.navigate(['/home/tab2', this.phoneNumber]);
      }
    }


  }

  buscarcontacto(conta) {
    const option: IContactFindOptions = {
      filter: conta,
      multiple: true,
      hasPhoneNumber: true
    };

    this.contacts.find(this.ourtype, option).then(conts => {
      this.myContacts = conts;
    });
    if (this.myContacts.length === 0) {
      this.service.presentToast('Contacto no encontrado.');
    }
  }
  onKeyUp(ev) {
    this.buscarcontacto(ev.target.value);
  }
}
