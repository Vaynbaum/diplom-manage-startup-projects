import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutes } from './auth.routing';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { RegistrationComponent } from './registration/registration.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { ResetComponent } from './reset/reset.component';

@NgModule({
  imports: [CommonModule, RouterOutlet, AuthRoutes, SharedModule],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegistrationComponent,
    RecoveryComponent,
    ResetComponent,
  ],
})
export class AuthModule {}
