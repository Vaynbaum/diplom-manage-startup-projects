import { MessageService } from './../../services/message.service';
import { SettingType } from './../../models/special/setting';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { settingInitialState } from '../../store/setting/setting.reducer';
import {
  CONFIG_DIALOG,
  EXIT_ICON,
  LINK_PAGE_PROFILE,
  LINK_PAGE_SIGNIN,
  MENU_ICON,
  NAME_REDUCER_PROFILE,
  NAME_REDUCER_SETTING,
  NOTE_ICON,
  PROFILE_ICON,
} from '../../consts';
import { compileURLImg, DURATION_MESSAGE, OK } from '../../functions';
import { DEFAULT_AVA } from '../../../system/consts';
import { profileInitialState } from '../../store/profile/profile.reducer';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PROFILE } from '../../../system/phrases';
import { LOGOUT } from '../../phrases';
import { logout } from '../../store/profile/profile.actions';
import { UserAbstractModel } from '../../models/backend/user_abstract.model';
import { AvatarModel } from '../../models/backend/avatar.model';
import { NoteModel, ReadedNotesModel } from '../../models/backend/note.model';
import { NoteService } from '../../services/note.service';
import { getNotes } from '../../store/message/message.actions';
import { notesGetted } from '../../store/message/message.effects';
import { DialogNoteMoreComponent } from '../../../system/dialog/dialog-note-more/dialog-note-more.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityMessageModel } from '../../models/backend/act_message.model';
import { Offset2Side } from '../../interfaces/dialog-notes-more';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  notifications: NoteModel[] = [];
  setting$: Observable<SettingType> = this.store.select(NAME_REDUCER_SETTING);
  setting: SettingType = settingInitialState;
  initGetNotes = false;
  offset = new Offset2Side(0, new Map());
  unreaded = 0;

  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);
  profile: UserAbstractModel = profileInitialState;

  noteBtn = { icon: NOTE_ICON };
  menuBtn = { icon: MENU_ICON };
  menuAvaBtns = [
    {
      icon: PROFILE_ICON,
      title: PROFILE,
      action: () => this.goToMyProfile(),
    },
    {
      icon: EXIT_ICON,
      title: LOGOUT,
      action: () => this.logout(),
    },
  ];

  constructor(
    private store: Store<{ setting: SettingType; profile: UserAbstractModel }>,
    private router: Router,
    private messageService: MessageService,
    public dialog: MatDialog,
    public noteService: NoteService,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {}
  mg: any;
  nsg: any;
  ng: any;
  ss: any;
  ps: any;
  ngOnDestroy(): void {
    this.mg.unsubscribe();
    this.nsg.unsubscribe();
    this.ng.unsubscribe();
    this.ss.unsubscribe();
    this.ps.unsubscribe();
    this.unreaded = 0;
  }

  @Output() MenuOnClick = new EventEmitter<any>();
  ngOnInit() {
    this.unreaded = 0;
    this.mg = this.messageService.messageGetted.subscribe(
      (msg: ActivityMessageModel) => {
        if (msg.mode == 'add' && msg.sender_id != this.profile.id) {
          this.noteService.playAudio();
          const ref = this._snackBar.open(
            `"${msg.activity_name}", ${msg.sender.firstname}: ${msg.text}`,
            'Прочитать',
            {
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              duration: DURATION_MESSAGE,
            }
          );
          ref.onAction().subscribe(() => {
            // console.log('прочиталь');
          });
        }
      }
    );

    this.nsg = notesGetted.subscribe((res) => {
      let init = this.notifications.length == 0;
      if (init) this.notifications = [];
      res.items.forEach((item) => {
        if (item.is_readed == false) this.unreaded += 1;
        if (!this.notifications.find((m) => m.id == item.id))
          this.notifications.push(structuredClone(item));
      });
      this.notifications = structuredClone(this.notifications);
      if (res.offset != undefined) {
        this.offset.check.set(this.offset.offset, true);
        this.offset.offset = res.offset + 1;
      }
      if (init) {
        this.initGetNotes = true;
      }
    });

    this.ng = this.noteService.noteGetted.subscribe((note) => {
      if (note instanceof ReadedNotesModel) {
        note.ids.forEach((id) => {
          let n = this.notifications.find((no) => no.id == id);
          if (n?.is_readed != note.readed) {
            this.unreaded -= 1;
          }
          if (n) n.is_readed = note.readed;
        });
      } else {
        this.noteService.playAudio();
        const ref = this._snackBar.open(note.text, 'Прочитать', {
          horizontalPosition: 'left',
          verticalPosition: 'bottom',
          duration: DURATION_MESSAGE,
        });
        ref.onAction().subscribe(() => {
          let data = { ids: [note.id] };
          this.noteService.SendMessage(data);
        });
        if (!note.is_readed) this.unreaded += 1;
        this.notifications.unshift(structuredClone(note));
        this.notifications = structuredClone(this.notifications);
      }
    });

    this.ss = this.setting$?.subscribe((res: SettingType) => {
      this.setting = res;
    });

    this.ps = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.profile = res;
      if (this.profile.id != -1 && !this.initGetNotes)
        this.store.dispatch(
          getNotes({ parametr: { limit: 50, offset: this.offset.offset } })
        );
    });
  }

  readedColor(note: NoteModel) {
    if (note.is_readed) return { color: '#6c757d' };
    return {};
  }

  showMore() {
    const dialogRef = this.dialog.open(DialogNoteMoreComponent, {
      ...CONFIG_DIALOG,
      data: {
        notifications: this.notifications,
        offset: this.offset,
        noteService: this.noteService,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.offset.check.set(this.offset.offset, false);
    });
  }

  readLastNote() {
    let needSend = false;
    let arr: number[] = [];
    this.notifications.slice(0, 4).forEach((item: NoteModel) => {
      if (!item.is_readed) {
        arr.push(item.id);
        needSend = true;
      }
    });
    if (needSend) {
      let data = { ids: arr };
      this.noteService.SendMessage(data);
    }
  }

  urlAvatar(avatar: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_AVA);
  }

  getunreaded() {
    let v = this.unreaded;
    if (v == 0) return '';
    if (v > 99) return `${v}+`;
    return v;
  }

  logout() {
    this.unreaded = 0;
    this.notifications = [];
    this.initGetNotes = false;
    this.authService.DeleteTokens();
    this.messageService.Close();
    this.noteService.Close();
    this.router.navigate([LINK_PAGE_SIGNIN], {
      queryParams: { logoutSuccess: true },
    });
    this.store.dispatch(logout());
  }

  goToMyProfile() {
    this.router.navigate([LINK_PAGE_PROFILE]);
  }
  menuOnClick() {
    this.MenuOnClick.emit();
  }
}
