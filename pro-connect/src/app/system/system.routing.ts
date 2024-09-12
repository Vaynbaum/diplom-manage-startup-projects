import { Routes, RouterModule } from '@angular/router';
import { SystemComponent } from './system.component';
import { ProfileComponent } from './profile/profile.component';
import * as CN from '../shared/consts';
import { GroupsComponent } from './groups/groups.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { GroupComponent } from './group/group.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { NewsComponent } from './news/news.component';
import { ActivitiesComponent } from './activities/activities.component';
import { LikeMindedsComponent } from './like-mindeds/like-mindeds.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ActivityComponent } from './activity/activity.component';
import { ActivityEditComponent } from './activity-edit/activity-edit.component';
import { ActivityWorkComponent } from './activity-work/activity-work.component';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    canActivate: [AuthGuard],
    children: [
      { path: `${CN.PROFILE_PAGE}/:id`, component: ProfileComponent },
      { path: CN.PROFILE_EDIT_PAGE, component: ProfileEditComponent },
      { path: CN.NEWS_PAGE, component: NewsComponent },
      { path: CN.GROUPS_PAGE, component: GroupsComponent },
      { path: `${CN.GROUP_PAGE}/:id`, component: GroupComponent },
      { path: CN.GROUP_EDIT_PAGE, component: GroupEditComponent },
      { path: CN.ACTIVITIES_PAGE, component: ActivitiesComponent },
      { path: `${CN.ACTIVITY_PAGE}/:id`, component: ActivityComponent },
      { path: CN.ACTIVITY_EDIT_PAGE, component: ActivityEditComponent },
      { path: CN.ACTIVITY_WORK_PAGE, component: ActivityWorkComponent },
      { path: CN.LIKE_MINDEDS_PAGE, component: LikeMindedsComponent },
    ],
  },
];

export const SystemRoutes = RouterModule.forChild(routes);
