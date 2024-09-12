import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './system.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { SystemRoutes } from './system.routing';
import { GroupsComponent } from './groups/groups.component';
import { DialogProfileMoreComponent } from './dialog/dialog-profile-more/dialog-profile-more.component';
import { DialogTagMoreComponent } from './dialog/dialog-tag-more/dialog-tag-more.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { DialogContactAddComponent } from './dialog/dialog-contact-add/dialog-contact-add.component';
import { DialogSkillAddComponent } from './dialog/dialog-skill-add/dialog-skill-add.component';
import { GroupComponent } from './group/group.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { NewsComponent } from './news/news.component';
import { DialogGroupMoreComponent } from './dialog/dialog-group-more/dialog-group-more.component';
import { ActivitiesComponent } from './activities/activities.component';
import { LikeMindedsComponent } from './like-mindeds/like-mindeds.component';
import { DialogGroupRoleAddComponent } from './dialog/dialog-group-role-add/dialog-group-role-add.component';
import { DialogAssignRoleComponent } from './dialog/dialog-assign-role/dialog-assign-role.component';
import { DialogItemsMoreComponent } from './dialog/dialog-items-more/dialog-items-more.component';
import { DialogGroupAddComponent } from './dialog/dialog-group-add/dialog-group-add.component';
import { DialogVacancyAddComponent } from './dialog/dialog-vacancy-add/dialog-vacancy-add.component';
import { DialogVacanciesMoreComponent } from './dialog/dialog-vacancies-more/dialog-vacancies-more.component';
import { DialogVacancyMoreComponent } from './dialog/dialog-vacancy-more/dialog-vacancy-more.component';
import { DialogVacancyResponsesComponent } from './dialog/dialog-vacancy-responses/dialog-vacancy-responses.component';
import { ActivityComponent } from './activity/activity.component';
import { DialogActivityMoreComponent } from './dialog/dialog-activity-more/dialog-activity-more.component';
import { ActivityEditComponent } from './activity-edit/activity-edit.component';
import { DialogActivityAddComponent } from './dialog/dialog-activity-add/dialog-activity-add.component';
import { DialogTagAddComponent } from './dialog/dialog-tag-add/dialog-tag-add.component';
import { DialogRequestAddComponent } from './dialog/dialog-request-add/dialog-request-add.component';
import { DialogInvationAddComponent } from './dialog/dialog-invation-add/dialog-invation-add.component';
import { ActivityWorkComponent } from './activity-work/activity-work.component';
import { MarkdownModule } from 'ngx-markdown';
import 'prismjs';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-python.min.js';
import 'prismjs/components/prism-csharp.min.js';
import 'prismjs/components/prism-css.min.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'emoji-toolkit/lib/js/joypixels.min.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import 'prismjs/plugins/command-line/prism-command-line.js';
import { DialogTaskAddComponent } from './dialog/dialog-task-add/dialog-task-add.component';
import { DialogTaskAssignComponent } from './dialog/dialog-task-assign/dialog-task-assign.component';
import { DialogTaskStatusComponent } from './dialog/dialog-task-status/dialog-task-status.component';
import { DialogAssignsMoreComponent } from './dialog/dialog-assigns-more/dialog-assigns-more.component';
import { DialogFilesMoreComponent } from './dialog/dialog-files-more/dialog-files-more.component';
import { DialogResetPasswordComponent } from './dialog/dialog-reset-password/dialog-reset-password.component';
import { DialogResetEmailComponent } from './dialog/dialog-reset-email/dialog-reset-email.component';
import { DialogPostAddComponent } from './dialog/dialog-post-add/dialog-post-add.component';
import { DialogNoteMoreComponent } from './dialog/dialog-note-more/dialog-note-more.component';
import { DialogPortfolioMoreComponent } from './dialog/dialog-portfolio-more/dialog-portfolio-more.component';
import { DialogPortfolioAddComponent } from './dialog/dialog-portfolio-add/dialog-portfolio-add.component';
import { DialogPortfoliosMoreComponent } from './dialog/dialog-portfolios-more/dialog-portfolios-more.component';
import { DialogInviteAddComponent } from './dialog/dialog-invite-add/dialog-invite-add.component';

@NgModule({
  imports: [
    CommonModule,
    RouterOutlet,
    SystemRoutes,
    SharedModule,
    MarkdownModule.forRoot(),
  ],
  declarations: [
    SystemComponent,
    ProfileComponent,
    ProfileEditComponent,
    DialogContactAddComponent,
    DialogProfileMoreComponent,
    DialogTagMoreComponent,
    DialogSkillAddComponent,
    DialogGroupMoreComponent,
    DialogGroupRoleAddComponent,
    DialogAssignRoleComponent,
    DialogItemsMoreComponent,
    DialogGroupAddComponent,
    DialogVacancyAddComponent,
    DialogVacanciesMoreComponent,
    DialogVacancyMoreComponent,
    DialogVacancyResponsesComponent,
    DialogActivityMoreComponent,
    DialogActivityAddComponent,
    DialogNoteMoreComponent,
    DialogTagAddComponent,
    DialogRequestAddComponent,
    DialogInviteAddComponent,
    DialogInvationAddComponent,
    DialogTaskAddComponent,
    DialogTaskAssignComponent,
    DialogTaskStatusComponent,
    DialogAssignsMoreComponent,
    DialogFilesMoreComponent,
    DialogResetPasswordComponent,
    DialogResetEmailComponent,
    DialogPostAddComponent,
    DialogPortfolioMoreComponent,
    DialogPortfolioAddComponent,
    DialogPortfoliosMoreComponent,
    GroupsComponent,
    GroupComponent,
    GroupEditComponent,
    NewsComponent,
    ActivitiesComponent,
    ActivityComponent,
    ActivityEditComponent,
    ActivityWorkComponent,
    LikeMindedsComponent,
  ],
})
export class SystemModule {}
