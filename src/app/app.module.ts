import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Contacts } from '@ionic-native/contacts/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicGestureConfig } from './servicio/IonicGestureConfig.Service';
import {NgxMaskIonicModule} from 'ngx-mask-ionic';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            ReactiveFormsModule,
            FormsModule,
            IonicStorageModule.forRoot(), 
            NgxMaskIonicModule.forRoot()],
           providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig
  },
    Contacts, AndroidPermissions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
