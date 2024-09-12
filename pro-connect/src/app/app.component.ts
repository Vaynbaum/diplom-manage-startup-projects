import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { CookieService } from './shared/services/cookie.service';
import { SharedModule } from './shared/shared.module';
import { UserService } from './shared/services/user.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_DATE_FORMATS } from './date-format';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import 'moment/locale/ru';
import { OtherService } from './shared/services/other.service';
import { TagService } from './shared/services/tag.service';
import { NgxPhotoEditorModule } from 'ngx-photo-editor';
import { GroupService } from './shared/services/group.service';
import { ActivityService } from './shared/services/activity.service';
import { FileService } from './shared/services/file.service';
import { MessageService } from './shared/services/message.service';
import { NoteService } from './shared/services/note.service';
import { PortfolioService } from './shared/services/portfolio.service';
import { AdminService } from './shared/services/admin.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule, NgxPhotoEditorModule],
  providers: [
    AuthService,
    CookieService,
    UserService,
    TagService,
    OtherService,
    GroupService,
    ActivityService,
    FileService,
    MessageService,
    NoteService,
    PortfolioService,
    AdminService,
    { provide: MAT_DATE_LOCALE, useValue: 'ru' },
    provideMomentDateAdapter(MY_DATE_FORMATS),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
