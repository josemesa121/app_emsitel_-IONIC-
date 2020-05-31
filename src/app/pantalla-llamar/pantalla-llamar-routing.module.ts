import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PantallaLlamarPage } from './pantalla-llamar.page';

const routes: Routes = [
  {
    path: '',
    component: PantallaLlamarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PantallaLlamarPageRoutingModule {}
