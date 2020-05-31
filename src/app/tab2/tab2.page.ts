import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { EmsivozServiceService } from '../servicio/emsivoz-service.service';
import { User } from '../servicio/localcodesms';
import * as JsSIP from 'jssip';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';

declare var AudioToggle: any;
declare var sensors: any;
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild('callAudioEl', { static: false }) callAudioEl: any;
  ua: any;
  session: any;
  dialedNumber = '';
  dialDTMF = '';
  makeCallFromContact = false;
  mutedCall = false;
  activeCall = false;
  datCredit: any;
  datUsuarios = {} as User;
  argumento: string;
  myStream: MediaStream;
  callStatus: '';
  Sip: any;
  activeTmf = false;
  callTime = '';
  updateTimeTimeout: any;
  valor = /^3[\d]{9}$/;
  speakerCall: boolean;
  numeroLlamar = '';
  proximity: number;
  showingCallBg = false;
  PhoneNumber;
  PhoneNumberN: any;
  val: any;
  PhoneType: 'internacional' | 'celular' | 'local' = 'celular';

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private androidPermissions: AndroidPermissions,
    public alertController: AlertController,
    private servicio: EmsivozServiceService,
    private storage: Storage,
    private activatedRoute: ActivatedRoute
  ) {
    this.datUsuarios = new User();
    this.getProfile();
    platform.ready().then(() => {
      this.initSensor();
    });
  }
  customPatterns = { '0': { pattern: new RegExp('[0-9+]') } };
  async ngOnInit(): Promise<void> {
    this.getProfile();
    this.Sip = await this.storage.get('data');
    const sipURL = 'wss://emsivoz.emsitel.com.co:8089/ws';
    const sipUri = `sip:${this.Sip.sip.username}@emsivoz.emsitel.com.co`;
    const sipPassword = this.Sip.sip.uipass;

    const socket = new JsSIP.WebSocketInterface(sipURL);

    const configuration = {
      sockets: [socket],
      uri: sipUri,
      password: sipPassword,
      realm: 'asterisk.org',
    };

    this.ua = new JsSIP.UA(configuration);
    await this.ua.start();

    this.ua.on('connected', (e) => {
      if (this.makeCallFromContact) {
        this.makeCallFromContact = false;
        this.makeCall();
      }
    });

    if (this.activatedRoute.snapshot.paramMap.get('phone')) {
      this.makeCallFromContact = true;
      this.activatedRoute.paramMap.subscribe((params) => {
        if (params) {
          this.dialedNumber = params.get('phone');
          this.revisarMascara();
        }
      });
    }

    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
      .then((status) => {
        if (status.hasPermission) {
        } else {
          this.androidPermissions
            .requestPermissions([
              this.androidPermissions.PERMISSION.RECORD_AUDIO,
              this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT,
            ])
            .then(() => { });
        }
      });
  }

  async initSensor() {
    sensors.enableSensor('PROXIMITY');
    setInterval(() => {
      sensors.getState(async (values) => {
        this.proximity = values[0];
        if (this.activeCall) {
          if (this.proximity < 2) {
            this.showingCallBg = true;
          } else {
            this.showingCallBg = false;
          }
        } else {
          this.showingCallBg = false;
        }
      });
    }, 300);
  }

  delete() {
    this.dialedNumber = this.dialedNumber.substring(
      0,
      this.dialedNumber.length - 1
    );
    if (this.dialedNumber.length <= 0) {
      this.servicio.presentToast('No puedes seguir borrando.');
    }
  }

  dial(num: any) {
    if (this.activeCall) {
      this.dialDTMF = this.dialDTMF + num;
      this.session.sendDTMF(num);
    } else {
      this.dialedNumber = this.dialedNumber + num;
      this.revisarMascara();
    }
  }
  dialmore(e) {
    if (e.type === 'press') {
      this.dialedNumber = this.dialedNumber + '+';
      this.revisarMascara();
    }
  }
  makeCall() {
    const originalPhone = JSON.parse(JSON.stringify(this.dialedNumber));
    if (originalPhone.charAt(0) === '+') {
      this.PhoneNumber = originalPhone.replace('+', '009');
    } else {
      this.PhoneNumber = originalPhone.replace(/[^0-9]/gi, '');
    }
    this.dialDTMF = '';
    document.querySelector('ion-tab-bar').style.display = 'none';

    this.callTime = '00:00';
    this.speakerCall = false;
    this.servicio.getcheckCredit().then((cred) => {
      this.datCredit = cred.data.credit;
      if (this.datCredit <= 100) {
        this.servicio.presentToast(
          'Saldo Insuficiente para realizar esta llamada.'
        );
        this.endCall();
      }
    });

    if (this.PhoneNumber === '') {
      this.servicio.presentToast(
        'El Número de telefono ingresado no es correcto'
      );
      this.endCall();
    }

    if (!this.ua.isConnected()) {
      this.servicio.presentToast(
        'Sin conexion, Lo sentimos vuelve a intentar.'
      );
      document.querySelector('ion-tab-bar').style.display = 'flex';
      return;
    }

    if (this.platform.is('cordova')) {
      this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT,
      ]);
      this.androidPermissions
        .checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
        .then(
          (result) => {
            const eventHandlers = {
              progress: (e) => {
                this.activeCall = true;
              },
              failed: (e) => {
                clearTimeout(this.updateTimeTimeout);
                this.activeCall = false;
                document.querySelector('ion-tab-bar').style.display = 'flex';
                this.activeTmf = false;
                this.dialedNumber = '';
              },
              ended: (e) => {
                clearTimeout(this.updateTimeTimeout);
                this.activeCall = false;
                this.getProfile();
                this.dialedNumber = '';
                document.querySelector('ion-tab-bar').style.display = 'flex';
              },
              confirmed: (e) => {
                this.activeCall = true;
                this.callTime = '';
                this.updateCallTime();
                this.updateTimeTimeout = setInterval(this.updateCallTime, 950);
              },
            };

            const options = {
              eventHandlers,
              mediaConstraints: { audio: true, video: false },
            };

            this.session = this.ua.call(this.PhoneNumber, options);
            this.activeCall = true;

            this.session.connection.addEventListener('addstream', async (e) => {
              const remoteAudio = document.createElement('audio');
              remoteAudio.srcObject = e.stream;
              remoteAudio.play();
              this.initSound();
              try {
                await remoteAudio.play();
              } catch (err) {
              }
            });
          },
          (err) => {
            this.androidPermissions
              .requestPermissions([
                this.androidPermissions.PERMISSION.RECORD_AUDIO,
                this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT,
              ])
              .then(() => {
                this.makeCall();
              });
          }
        );
    }
  }

  initSound() {
    if (this.platform.is('cordova')) {
      if (this.platform.is('android')) {
        AudioToggle.setAudioMode(AudioToggle.RINGTONE);
      } else {
        AudioToggle.setAudioMode(AudioToggle.EARPIECE);
      }
    }
  }

  toggleSound() {
    if (this.platform.is('cordova')) {
      if (this.speakerCall) {
        if (this.platform.is('android')) {
          AudioToggle.setAudioMode(AudioToggle.RINGTONE);
        } else {
          AudioToggle.setAudioMode(AudioToggle.EARPIECE);
        }
        this.speakerCall = false;
      } else {
        AudioToggle.setAudioMode(AudioToggle.SPEAKER);
        this.speakerCall = true;
      }
    }
  }

  updateCallTime = () => {
    if (!this.activeCall) {
      return;
    }

    if (!this.session.start_time) {
      return;
    }

    const now = new Date().getTime();
    const diff = now - this.session.start_time.getTime();
    let seconds = Math.floor(diff / 1000);
    const mins = Math.floor(seconds / 60);
    seconds = seconds % 60;

    this.callTime = `${mins < 10 ? '0' : ''}${mins}:${
      seconds < 10 ? '0' : ''
      }${seconds}`;
  }

  toggleMute() {
    if (this.mutedCall) {
      this.session.unmute();
      this.mutedCall = false;
    } else {
      this.session.mute();
      this.mutedCall = true;
    }
  }

  endCall() {
    document.querySelector('ion-tab-bar').style.display = 'flex';
    this.session.terminate();
    this.dialedNumber = '';
    this.getProfile();
  }


  getProfile() {
    this.servicio
      .getProfile()
      .then((profile) => {
        this.datUsuarios = profile.data.user;
        this.servicio
          .getcheckCredit()
          .then((credit) => {
            this.datCredit = credit.data.credit;
          })
          .catch((error) => {
            if (error.response.data.errors.email) {
              this.servicio.presentToast(error.response.data.errors.email);
            }
          });
      })
      .catch((error) => {
        if (error.response.data.message) {
          this.servicio.presentToast(error.response.data.message);
        }
      });
  }
  tmf() {
    this.activeTmf = true;
  }
  cerrar() {
    this.activeTmf = false;
  }
  press(e) {
    this.dialedNumber = '';
    this.numeroLlamar = '';
  }

  revisarMascara() {
    if (
      (this.dialedNumber && this.dialedNumber.includes('+')) ||
      this.dialedNumber.startsWith('0')
    ) {
      setTimeout(() => {
        this.PhoneType = 'internacional';
        this.dialedNumber = this.dialedNumber.replace(/[^0-9+]/gi, '');
      }, 100);
    } else {
      setTimeout(() => {
        if (this.dialedNumber && this.dialedNumber.startsWith('5')) {
          this.PhoneType = 'local';
        } else {
          this.PhoneType = 'celular';
        }
      }, 100);
    }
  }
}
