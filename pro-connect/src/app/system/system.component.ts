import { MessageService } from './../shared/services/message.service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { resizeWindow } from '../shared/store/setting/setting.actions';
import { SettingType } from '../shared/models/special/setting';
import { settingInitialState } from '../shared/store/setting/setting.reducer';
import { ME, NAME_REDUCER_SETTING } from '../shared/consts';
import { loadMyProfile } from '../shared/store/profile/profile.actions';
import { NoteService } from '../shared/services/note.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss'],
})
export class SystemComponent implements OnInit, OnDestroy {
  setting$: Observable<SettingType> = this.store.select(NAME_REDUCER_SETTING);
  setting: SettingType = settingInitialState;
  constructor(
    private store: Store<{ setting: SettingType }>,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private noteService: NoteService
  ) {}

  ss: any;
  ngOnDestroy(): void {
    this.ss.unsubscribe();
  }

  ngOnInit(): void {
    this.store.dispatch(loadMyProfile({ parametr: ME }));
    this.messageService.Connect();
    this.noteService.Connect();
    this.ss = this.setting$?.subscribe((res: SettingType) => {
      this.setting = res;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.store.dispatch(resizeWindow({ event: event }));
  }

  selectModeSidenav() {
    if (this.setting.isMobile) return 'over';
    return 'side';
  }

  selectBackdrop() {
    if (this.setting.isMobile) return 'true';
    return 'false';
  }
}
