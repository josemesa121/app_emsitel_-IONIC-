import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidarCodigoPageRoutingModule } from './validar-codigo-routing.module';

import { ValidarCodigoPage } from './validar-codigo.page';
import {NgxMaskIonicModule} from 'ngx-mask-ionic';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidarCodigoPageRoutingModule,
    NgxMaskIonicModule
  ],
  declarations: [ValidarCodigoPage]
})
export class ValidarCodigoPageModule {}
