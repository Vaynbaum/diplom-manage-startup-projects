import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AUTH_MODULE, LINK_PAGE_SIGNIN, SYSTEM_MODULE } from './shared/consts';

export const routes: Routes = [
  {
    path: '',
    redirectTo: LINK_PAGE_SIGNIN,
    pathMatch: 'full',
  },
  {
    path: AUTH_MODULE,
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: SYSTEM_MODULE,
    loadChildren: () =>
      import('./system/system.module').then((m) => m.SystemModule),
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
