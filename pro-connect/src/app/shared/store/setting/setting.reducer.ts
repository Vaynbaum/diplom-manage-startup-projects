import { createReducer, on } from '@ngrx/store';
import { resizeWindow } from './setting.actions';
import { WIDTH_MOBILE } from '../../../system/consts';
import { SettingType } from '../../models/special/setting';

function checkIsMobile(w: Window) {
  return w.innerWidth <= WIDTH_MOBILE;
}

export const settingInitialState: SettingType = {
  isMobile: checkIsMobile(window),
};

export const settingReducer = createReducer(
  settingInitialState,
  on(resizeWindow, (state, { event }) => ({
    ...state,
    isMobile: checkIsMobile(event.target),
  }))
);
