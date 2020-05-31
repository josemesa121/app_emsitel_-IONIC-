import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PantallaLlamarPageRoutingModule } from './pantalla-llamar-routing.module';

import { PantallaLlamarPage } from './pantalla-llamar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PantallaLlamarPageRoutingModule
  ],
  declarations: [PantallaLlamarPage]
})
export class PantallaLlamarPageModule {}
