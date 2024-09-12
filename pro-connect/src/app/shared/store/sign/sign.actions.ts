import { createAction, props } from '@ngrx/store';
import { SigninModel } from '../../models/backend/signin.model';
import { TokensModel } from '../../models/backend/tokens.model';
import { MessageModel } from '../../models/backend/message.model';
import { SignupModel } from '../../models/backend/signup.model';
import {
  ActivationModel,
  ResetPasswordModel,
} from '../../models/backend/reset_password.model';

export const signin = createAction(
  '[Login Page] Signin',
  props<{ credentials: SigninModel }>()
);

export const signup = createAction(
  '[Registration Page] Signup',
  props<{ user: SignupModel }>()
);

export const signinSuccess = createAction(
  '[Auth Service] Signin Success',
  props<{ tokens: TokensModel }>()
);

export const signinFailure = createAction(
  '[Auth Service] Signin Failed',
  props<{ error: any }>()
);

export const signupSuccess = createAction(
  '[Auth Service] Signup Success',
  props<{ message: MessageModel }>()
);

export const signupFailure = createAction(
  '[Auth Service] Signup Failed',
  props<{ error: any }>()
);

export const refreshToken = createAction(
  '[Tokens Interceptor] Refresh Token',
  props<{ act: Function; parametr: object }>()
);

export const refreshTokenSuccess = createAction(
  '[Auth Service] Refresh Token Success',
  props<{ tokens: TokensModel; act: Function; parametr: object }>()
);

export const refreshTokenFailure = createAction(
  '[Auth Service] Refresh Token Failed',
  props<{ error: any }>()
);
export const recoveryPassword = createAction(
  '[Recovery Component] Recovery Password',
  props<{ email: string }>()
);
export const resetPassword = createAction(
  '[Reset Component] Reset Password',
  props<{ parametr: ResetPasswordModel }>()
);
export const resetPasswordSuccess = createAction(
  '[Reset Component] Reset Password Success',
  props<{ message: MessageModel }>()
);
export const activation = createAction(
  '[Login Page] Activation Profile',
  props<{ parametr: ActivationModel }>()
);
