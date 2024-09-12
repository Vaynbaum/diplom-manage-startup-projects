import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { SIGNIN_PAGE, SIGNUP_PAGE } from '../shared/consts';
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [
  { path: SIGNIN_PAGE, component: LoginComponent },
  { path: SIGNUP_PAGE, component: RegistrationComponent },
  { path: 'recovery', component: RecoveryComponent },
  { path: 'reset', component: ResetComponent },
];

export const AuthRoutes = RouterModule.forChild(routes);
