import { MY_PROFILE, NEWS, ACTIVITIES, GROUPS, LIKE_MINDEDS } from './phrases';

export const ME = 'me';

export const EMAIL = 'email';

export const FNAME = 'firstname';
export const LNAME = 'lastname';

export const TITLE = 'title';
export const BADGE = 'badge';
export const LOCATION = 'location_on';
export const NICK = 'alternate_email';

export const TEXT = 'text';
export const TEXTAREA = 'textarea';
export const PSWD = 'password';

export const DOMAIN_AUTH = 'auth';
export const METHOD_SIGNIN = 'signin';
export const METHOD_SIGNUP = 'signup';
export const METHOD_REFRESH_TOKEN = 'refresh_token';

export const AUTH_MODULE = 'auth';
export const SIGNIN_PAGE = 'signin';
export const SIGNUP_PAGE = 'signup';
export const SYSTEM_MODULE = 'system';

export const PROFILE_PAGE = 'profile';
export const PROFILE_EDIT_PAGE = `${PROFILE_PAGE}-edit`;
export const GROUP_PAGE = 'group';
export const ACTIVITY_PAGE = 'activity';
export const ACTIVITY_EDIT_PAGE = `${ACTIVITY_PAGE}-edit`;
export const ACTIVITY_WORK_PAGE = `${ACTIVITY_PAGE}-work`;
export const GROUP_EDIT_PAGE = `${GROUP_PAGE}-edit`;
export const GROUP_ADD_PAGE = `${GROUP_PAGE}-add`;
export const GROUPS_PAGE = `${GROUP_PAGE}s`;
export const NEWS_PAGE = 'feed';
export const ACTIVITIES_PAGE = 'activities';
export const LIKE_MINDEDS_PAGE = 'like_mindeds';

export const LINK_PAGE_SIGNIN = `/${AUTH_MODULE}/${SIGNIN_PAGE}`;
export const LINK_PAGE_SIGNUP = `/${AUTH_MODULE}/${SIGNUP_PAGE}`;
export const LINK_PAGE_PROFILE_SHORT = `/${SYSTEM_MODULE}/${PROFILE_PAGE}`;
export const LINK_PAGE_GROUP_SHORT = `/${SYSTEM_MODULE}/${GROUP_PAGE}`;
export const LINK_PAGE_ACTIVITY = `/${SYSTEM_MODULE}/${ACTIVITY_PAGE}`;
export const LINK_PAGE_PROFILE = `${LINK_PAGE_PROFILE_SHORT}/${ME}`;

export const NAME_REDUCER_SETTING = 'setting';
export const NAME_REDUCER_PROFILE = 'profile';
export const NAME_REDUCER_GROUP = 'group';
export const NAME_REDUCER_ACTIVITY = 'activity';

export const PROFILE_ICON = 'person';
export const EXIT_ICON = 'logout';
export const NOTE_ICON = 'notifications';
export const MENU_ICON = 'menu';

export const MENU_LINKS = [
  { name: MY_PROFILE, icon: PROFILE_ICON, link: LINK_PAGE_PROFILE },
  { name: NEWS, icon: 'feed', link: `/${SYSTEM_MODULE}/${NEWS_PAGE}` },
  {
    name: LIKE_MINDEDS,
    icon: 'group',
    link: `/${SYSTEM_MODULE}/${LIKE_MINDEDS_PAGE}`,
  },
  { name: GROUPS, icon: 'groups', link: `/${SYSTEM_MODULE}/${GROUPS_PAGE}` },
  {
    name: ACTIVITIES,
    icon: 'work',
    link: `/${SYSTEM_MODULE}/${ACTIVITIES_PAGE}`,
  },
];

export const MIN_LENGTH_SUBSTR = 1;
export const WIDTH_DIALOG = '95vw';
export const MAX_WIDTH_DIALOG = '500px';
export const CONFIG_DIALOG = {
  width: WIDTH_DIALOG,
  maxWidth: MAX_WIDTH_DIALOG,
};

export const AGE_EXCEPTIONS = [11, 12, 13, 14];
export const AGE_YEARS = [5, 6, 7, 8, 9];
export const AGE_YR = [2, 3, 4];
export const YEAR = 'год';
export const YR = 'года';
export const YEARS = 'лет';

export const ADMIN_ROLE_ID = 2;
export const USER_ROLE_ID = 1;
