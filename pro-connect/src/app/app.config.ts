import { PortfolioEffects } from './shared/store/portfolio/portfolio.effects';
import {
  ApplicationConfig,
  LOCALE_ID,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { httpInterceptorProviders } from './http-interceptors/index';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideState, provideStore } from '@ngrx/store';
import { settingReducer } from './shared/store/setting/setting.reducer';
import {
  NAME_REDUCER_ACTIVITY,
  NAME_REDUCER_GROUP,
  NAME_REDUCER_PROFILE,
  NAME_REDUCER_SETTING,
} from './shared/consts';
import { AuthEffects } from './shared/store/sign/sign.effects';
import { provideEffects } from '@ngrx/effects';
import {
  ErrorShowEffects,
  SuccessShowEffects,
} from './shared/store/common.effects';
import { profileReducer } from './shared/store/profile/profile.reducer';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { SkillEffects } from './shared/store/tag/tag.effects';
import { ProfileEffects } from './shared/store/profile/profile.effects';
import { GroupEffects } from './shared/store/group/group.effects';
import { groupReducer } from './shared/store/group/group.reducer';
import { AuthGuard } from './shared/guards/auth.guard';
import { ActivityEffects } from './shared/store/activity/activity.effects';
import { activityReducer } from './shared/store/activity/activity.reducers';
import { FileEffects } from './shared/store/file/file.effects';
import { PostEffects } from './shared/store/post/post.effects';
import { MessageEffects } from './shared/store/message/message.effects';

registerLocaleData(localeRu, 'ru');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    httpInterceptorProviders,
    AuthGuard,
    provideStore(),
    provideEffects(
      SuccessShowEffects,
      ErrorShowEffects,
      AuthEffects,
      ProfileEffects,
      SkillEffects,
      GroupEffects,
      ActivityEffects,
      FileEffects,
      PostEffects,
      MessageEffects,
      PortfolioEffects
    ),
    provideState({ name: NAME_REDUCER_SETTING, reducer: settingReducer }),
    provideState({ name: NAME_REDUCER_PROFILE, reducer: profileReducer }),
    provideState({ name: NAME_REDUCER_GROUP, reducer: groupReducer }),
    provideState({ name: NAME_REDUCER_ACTIVITY, reducer: activityReducer }),
    { provide: LOCALE_ID, useValue: 'ru' },
  ],
};
