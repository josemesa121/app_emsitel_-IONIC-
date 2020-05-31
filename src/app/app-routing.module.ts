import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule),
   
  },
  {
    path: 'validar-codigo/:phone',
    loadChildren: () => import('./validar-codigo/validar-codigo.module').then(m => m.ValidarCodigoPageModule),
   
  },
  {
    path: 'pantalla-llamar',
    loadChildren: () => import('./pantalla-llamar/pantalla-llamar.module').then(m => m.PantallaLlamarPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pantalla-llamar/:phone',
    loadChildren: () => import('./pantalla-llamar/pantalla-llamar.module').then(m => m.PantallaLlamarPageModule),
    canActivate: [AuthGuard]
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
