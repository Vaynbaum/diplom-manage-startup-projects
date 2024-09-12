import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { DEFAULT_COVER } from '../system/consts';
import {
  UserAbstractDBModel,
  UserAbstractModel,
} from './models/backend/user_abstract.model';
import {
  FullGroupModel,
  GroupDBModel,
  GroupModel,
} from './models/backend/group.models';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  AGE_EXCEPTIONS,
  AGE_YEARS,
  AGE_YR,
  PSWD,
  YEAR,
  YEARS,
  YR,
} from './consts';
import { PSWD2, PSWD_N_M } from '../auth/consts';

export const OK = 'ОК';
export const DURATION_MESSAGE = 5000;

export function showMessage(snackBar: MatSnackBar, text?: string) {
  if (text && snackBar)
    snackBar.open(text, OK, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: DURATION_MESSAGE,
    });
}

export function showError(error: any, snackBar: MatSnackBar) {
  if (Array.isArray(error.error.detail)) {
    showMessage(snackBar, error.error.detail[0].msg);
  } else if (error.error.detail) {
    showMessage(snackBar, error.error.detail);
  }
}

export function compileUrlImgAssets(url?: string) {
  return `${environment.IMAGES_URL}/${url}`;
}

export function compileUrlImgServer(url: string) {
  return `${environment.BACKEND_IMAGE_URL}/static/${url}`;
}

export function isIcon(url: string) {
  return !url.includes('.');
}

export function compileURLImg(url: string | null, defaultUrlImage?: string) {
  if (url) {
    if (url.includes('http')) return url;
    else return compileUrlImgServer(url);
  } else if (defaultUrlImage) return compileUrlImgAssets(defaultUrlImage);
  else return null;
}

export function imageToBackground(
  coverImage: string | null,
  defaultUrlImage?: string
) {
  return {
    'background-image': `url(${compileURLImg(coverImage, defaultUrlImage)})`,
  };
}

export function selectCover(coverImage?: string | null) {
  if (coverImage) {
    return imageToBackground(coverImage);
  }
  return DEFAULT_COVER;
}

export function compileId(id: any) {
  return `id${id}`;
}

export function selectId(
  profile:
    | UserAbstractModel
    | UserAbstractDBModel
    | GroupModel
    | FullGroupModel
    | GroupDBModel
) {
  if (profile.username) return profile.username;
  else return compileId(profile.id);
}

export function checkId(id: string) {
  const regex = /^id\d+$/;
  return regex.test(id);
}

export function onOpenFileDialog(name: string) {
  document.getElementById(name)?.click();
}
export function commonDelete(arr: object[], item: object) {
  const index = arr.indexOf(item, 0);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
export function createPasswordNotMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pwd = control.get(PSWD);
    const cnfpwd = control.get(PSWD2);

    if (pwd && cnfpwd) {
      if (pwd.value === cnfpwd.value) {
        if (cnfpwd?.errors && cnfpwd?.errors[PSWD_N_M]) {
          delete cnfpwd.errors[PSWD_N_M];
          if (Object.keys(cnfpwd.errors).length === 0) {
            cnfpwd.setErrors(null);
          }
          cnfpwd.updateValueAndValidity();
        }
        return null;
      }
      cnfpwd.setErrors({ passwordNotMatch: true });
    }
    return null;
  };
}

function get_current_age(date: Date) {
  return (
    ((new Date().getTime() - date.getTime()) / (24 * 3600 * 365.25 * 1000)) | 0
  );
}

function selectPostfix(age: number) {
  let n = age % 10;
  if (n == 0 || AGE_YEARS.includes(n) || AGE_EXCEPTIONS.includes(n))
    return YEARS;
  if (n == 1) return YEAR;
  if (AGE_YR.includes(n)) return YR;
  return '';
}

export function getAge(birthdate?: string) {
  if (birthdate) {
    let age = get_current_age(new Date(birthdate));
    if (age != 0) return `${age} ${selectPostfix(age)}`;
    return '';
  }
  return '';
}
