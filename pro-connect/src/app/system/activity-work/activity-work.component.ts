import { messagesGetted } from './../../shared/store/message/message.effects';
import {
  createTask,
  deleteTask,
  getTasks,
  loadActivity,
  unassignTask,
  updateTask,
} from './../../shared/store/activity/activity.actions';
import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import {
  ACTIVITY_PAGE,
  CONFIG_DIALOG,
  NAME_REDUCER_ACTIVITY,
  NAME_REDUCER_PROFILE,
  SYSTEM_MODULE,
} from '../../shared/consts';
import { ActivatedRoute, Params } from '@angular/router';
import { FullActivityModel } from '../../shared/models/backend/activity.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  ActivityTaskAModel,
  AssignTaskModel,
  CreateTaskModel,
  FileModel,
  TaskDialogModel,
  TaskUserAssModel,
  UpdateTaskModel,
} from '../../shared/models/backend/activity_task.model';
import { CommonStatusModel } from '../../shared/models/backend/status.model';
import { AvatarModel } from '../../shared/models/backend/avatar.model';
import { compileURLImg, showMessage } from '../../shared/functions';
import {
  ADMIN_GROUP_ROLES,
  DEFAULT_AVA,
  FORMAT_DATE,
  GROUP_ROLE_OBSERVER,
  LOCALE_RU,
} from '../consts';
import { MatDialog } from '@angular/material/dialog';
import { DialogTaskAddComponent } from '../dialog/dialog-task-add/dialog-task-add.component';
import { anySuccess } from '../../shared/store/common.effects';
import { formatDate } from '@angular/common';
import { DialogTaskAssignComponent } from '../dialog/dialog-task-assign/dialog-task-assign.component';
import { DialogTaskStatusComponent } from '../dialog/dialog-task-status/dialog-task-status.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogAssignsMoreComponent } from '../dialog/dialog-assigns-more/dialog-assigns-more.component';
import { DialogFilesMoreComponent } from '../dialog/dialog-files-more/dialog-files-more.component';
import { profileInitialState } from '../../shared/store/profile/profile.reducer';
import { UserAbstractModel } from '../../shared/models/backend/user_abstract.model';
import { getMessages } from '../../shared/store/message/message.actions';
import {
  ActivityMessageModel,
  CreateMessageModel,
} from '../../shared/models/backend/act_message.model';
import { FormControl } from '@angular/forms';
import { MessageService } from '../../shared/services/message.service';
const MIN_HEIGHT = 10;

@Component({
  selector: 'app-activity-work',
  templateUrl: './activity-work.component.html',
  styleUrls: ['./activity-work.component.scss'],
})
export class ActivityWorkComponent implements OnInit, OnDestroy {
  menuBtn = {
    icon: 'more_vert',
    btns: [
      {
        title: 'Назначить',
        icon: 'assignment_ind',
        check: () => this.checkCUDTask(),
        actions: (req: ActivityTaskAModel) => this.assignTaskTo(req),
      },
      {
        title: 'Сменить статус',
        icon: 'grade',
        check: () => {
          return true;
        },
        actions: (req: ActivityTaskAModel) => this.changeTaskStatus(req),
      },
      {
        title: 'Изменить',
        icon: 'edit',
        check: () => this.checkCUDTask(),
        actions: (req: ActivityTaskAModel) => this.editTask(req),
      },
      {
        title: 'Удалить',
        icon: 'delete',
        check: () => this.checkCUDTask(),
        actions: (req: ActivityTaskAModel) => this.deleteTask(req),
      },
    ],
  };
  backButton = {
    icon: 'arrow_back',
    link: `/${SYSTEM_MODULE}/${ACTIVITY_PAGE}`,
  };
  isMessagePage = true;
  title = 'Рабочее место';
  backref = '';
  subAct: any;
  messageOffset: number = 0;
  profile: UserAbstractModel = profileInitialState;
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);
  activity?: FullActivityModel;
  activity$: Observable<FullActivityModel> = this.store.select(
    NAME_REDUCER_ACTIVITY
  );
  messages: ActivityMessageModel[] = [];
  msgCtrl = new FormControl(null);
  matCard: any;
  initGetMsgs = false;

  textarea = {
    type: 'text',
    formControl: this.msgCtrl,
    placeholder: 'Введите ваше сообщение',
    icon: 'send',
  };
  ngOnDestroy(): void {
    this.subAct.unsubscribe();
    this.ps.unsubscribe();
    this.msg.unsubscribe();
    this.mg.unsubscribe();
  }

  len_achive(task: ActivityTaskAModel) {
    let m = task.materials;
    return m.files.length + m.images.length;
  }
  urlAvatar(avatar?: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_AVA);
  }
  tz: any = '';
  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private injector: Injector,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private store: Store<{
      activity: FullActivityModel;
      profile: UserAbstractModel;
    }>
  ) {
    this.tz = new Date().toString();
    this.tz = this.tz.match(/([-\+][0-9]+)\s/)[1];
  }

  checkCUDTask() {
    if (this.profile && this.activity) {
      let owner = this.activity.creater_id == this.profile.id;
      let inTeamInd = this.activity.group?.users.findIndex((user) => {
        let ind = ADMIN_GROUP_ROLES.find((r) => r == user.role_id);
        return user.user_id == this.profile.id && ind && ind > -1;
      });

      let inTeam = inTeamInd && inTeamInd > 1 ? true : false;
      return owner || inTeam;
    }
    return false;
  }

  statusColor(status: CommonStatusModel) {
    if (status.id == 1) return { color: 'orange' };
    if (status.id == 2) return { color: 'blue' };
    if (status.id == 3) return { color: 'green' };
    if (status.id == 4) return { color: 'tomato' };
    return { color: 'black' };
  }

  addTask() {
    let c = structuredClone(CONFIG_DIALOG);
    c.maxWidth = '1000px';

    let t = new TaskDialogModel('');
    const dialogRef = this.dialog.open(DialogTaskAddComponent, {
      ...c,
      data: { task: t },
      injector: this.injector,
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogModel) => {
      if (result && this.activity) {
        let files = result.files.map(
          (file) =>
            new FileModel(file.id, file.name, file.owner_id, file.details)
        );
        let b = null;
        if (result.deadline) {
          b = formatDate(result.deadline, FORMAT_DATE, LOCALE_RU);
        }
        let t = new CreateTaskModel(
          result.name,
          this.activity.id,
          1,
          files,
          result.description,
          b
        );
        this.store.dispatch(createTask({ parametr: t }));
        let sub = anySuccess.subscribe((res) => {
          sub.unsubscribe();
          if (this.activity)
            this.store.dispatch(getTasks({ parametr: this.activity.id }));
        });
      }
    });
  }

  deleteTask(task: ActivityTaskAModel) {
    this.store.dispatch(deleteTask({ parametr: task.id }));
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      if (this.activity)
        this.store.dispatch(getTasks({ parametr: this.activity.id }));
    });
  }

  showFilesMore(task: ActivityTaskAModel) {
    const dialogRef = this.dialog.open(DialogFilesMoreComponent, {
      ...CONFIG_DIALOG,
      data: { materials: task.materials },
    });
  }

  showMoreAssigns(task: ActivityTaskAModel) {
    const dialogRef = this.dialog.open(DialogAssignsMoreComponent, {
      ...CONFIG_DIALOG,
      data: {
        users: task.users,
        activity_id: task.activity_id,
        canUnassign: this.checkCUDTask(),
      },
    });
  }

  changeTaskStatus(task: ActivityTaskAModel) {
    const dialogRef = this.dialog.open(DialogTaskStatusComponent, {
      ...CONFIG_DIALOG,
      data: { task: task },
    });
  }
  unassign(link: TaskUserAssModel) {
    let t = new AssignTaskModel(link.task_id, link.user_id);
    this.store.dispatch(unassignTask({ parametr: t }));
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      if (this.activity)
        this.store.dispatch(getTasks({ parametr: this.activity.id }));
    });
  }

  assignTaskTo(task: ActivityTaskAModel) {
    let users: any[] = [];
    if (this.activity?.group) {
      users = this.activity.group.users
        .filter((user) => user.role_id != GROUP_ROLE_OBSERVER)
        .map((user) => user.user);
    }
    if (!users?.find((user) => user.id == this.activity?.creater_id)) {
      if (this.activity?.creater) users.push(this.activity.creater);
    }

    users = users.filter(
      (user) => !task.users.find((u) => u.user_id == user.id)
    );
    if (users.length > 0) {
      const dialogRef = this.dialog.open(DialogTaskAssignComponent, {
        ...CONFIG_DIALOG,
        data: { task: task, users: users },
      });
    } else {
      showMessage(this._snackBar, 'Некого назначить');
    }
  }
  editTask(task: ActivityTaskAModel) {
    let c = structuredClone(CONFIG_DIALOG);
    c.maxWidth = '1000px';
    let ms: any[] = [];
    task.materials.files.forEach((image) =>
      ms.push({ ...image, type: 'file' })
    );
    task.materials.images.forEach((image) =>
      ms.push({ ...image, type: 'image' })
    );

    let t = new TaskDialogModel(task.name, ms, task.description, task.deadline);
    const dialogRef = this.dialog.open(DialogTaskAddComponent, {
      ...c,
      data: { task: t },
      injector: this.injector,
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogModel) => {
      if (result && this.activity) {
        let files = result.files.map(
          (file) =>
            new FileModel(file.id, file.name, file.owner_id, file.details)
        );
        let b = null;
        if (result.deadline) {
          b = formatDate(result.deadline, FORMAT_DATE, LOCALE_RU);
        }

        let addFiles: FileModel[] = [];
        let deleteIds: number[] = [];

        task.materials.files.forEach((material) => {
          let arr = files.filter((c) => c.id === material.id);
          if (arr.length == 0) deleteIds.push(material.id);
        });
        task.materials.images.forEach((material) => {
          let arr = files.filter((c) => c.id === material.id);
          if (arr.length == 0) deleteIds.push(material.id);
        });

        files.forEach((material) => {
          let arr1 = task.materials.files.filter((c) => c.id === material.id);
          let arr2 = task.materials.images.filter((c) => c.id === material.id);
          if (arr1.length == 0 && arr2.length == 0) addFiles.push(material);
        });

        let t = new UpdateTaskModel(
          result.name,
          task.id,
          deleteIds,
          addFiles,
          result.description,
          b
        );
        this.store.dispatch(updateTask({ parametr: t }));
        let sub = anySuccess.subscribe((res) => {
          sub.unsubscribe();
          if (this.activity)
            this.store.dispatch(getTasks({ parametr: this.activity.id }));
        });
      }
    });
  }

  checkDeadline(task: ActivityTaskAModel) {
    let now = new Date();
    let d = new Date(task.deadline);
    d.setHours(23);
    d.setMinutes(59);
    d.setSeconds(59);
    if (task.status_id != 3 && d.getTime() < now.getTime()) {
      return { color: 'red' };
    }
    return {};
  }
  ps: any;
  msg: any;
  mg: any;
  ngOnInit() {
    this.ps = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.profile = res;
    });

    this.msg = messagesGetted.subscribe((res) => {
      let init = this.messages.length == 0;
      if (init) this.messages = [];
      res.items.forEach((item) => {
        if (!this.messages.find((m) => m.id == item.id))
          this.messages.unshift(structuredClone(item));
      });
      this.messages = structuredClone(this.messages);
      if (res.offset != undefined || res.offset != null)
        this.messageOffset = res.offset;
      if (init) {
        this.initGetMsgs = true;
        this.croll();
      }
    });

    this.mg = this.messageService.messageGetted.subscribe(
      (msg: ActivityMessageModel) => {
        if (msg.mode == 'add') {
          this.messages.push(structuredClone(msg));
          this.messages = structuredClone(this.messages);
          this.msgCtrl.reset();
          this.croll();
        } else if (msg.mode == 'delete') {
          this.messages = this.messages.filter((m: any) => m.id != msg.id);
        }
      }
    );

    this.route.queryParams.subscribe((params: Params) => {
      this.backref = params['backref'];
      if (!isNaN(Number(this.backref)))
        this.store.dispatch(loadActivity({ parametr: Number(this.backref) }));
    });

    this.subAct = this.activity$?.subscribe((res: FullActivityModel) => {
      this.activity = res;
      if (this.activity && this.activity.id != -1) {
        this.store.dispatch(getTasks({ parametr: this.activity.id }));
        if (!this.initGetMsgs)
          this.store.dispatch(
            getMessages({
              parametr: {
                activity_id: this.activity.id,
                offset: this.messageOffset,
              },
            })
          );
      }
      let url = `/${SYSTEM_MODULE}/${ACTIVITY_PAGE}/${this.backref}`;
      if (!this.backref)
        url = `/${SYSTEM_MODULE}/${ACTIVITY_PAGE}/${this.activity.id}`;
      this.backButton.link = url;
    });
  }

  isMyMsg(message: ActivityMessageModel) {
    return message.sender_id == this.profile.id;
  }

  selectSide(msg: ActivityMessageModel) {
    let isMy = msg.sender_id == this.profile.id;
    return {
      'align-self': isMy ? 'flex-end' : 'flex-start',
    };
  }

  selectColor(msg: ActivityMessageModel) {
    let isMy = msg.sender_id == this.profile.id;
    return {
      background: isMy ? '#3f51b5' : '#f5f5f7',
      color: isMy ? 'white' : 'black',
    };
  }

  selectColorCreate(msg: ActivityMessageModel) {
    let isMy = msg.sender_id == this.profile.id;
    return {
      color: isMy ? 'white' : '#6c757d',
    };
  }

  selectPadPage() {
    if (this.isMessagePage) return { padding: '0 20px' };
    else return { padding: '0 20px 20px 20px' };
  }

  croll() {
    const TIMEOUT = 3;
    setTimeout(() => {
      this.matCard = document.getElementById('mat-card');
      this.matCard.scrollTo(0, this.matCard.scrollHeight);
    }, TIMEOUT);
  }

  openActs(menu: any, message: ActivityMessageModel) {
    if (this.canDeleteMsg(message)) menu.openMenu();
  }
  canDeleteMsg(msg: ActivityMessageModel) {
    if (this.profile && this.activity) {
      return (
        msg.sender_id == this.profile.id ||
        this.activity.creater_id == this.profile.id
      );
    }
    return false;
  }
  deleteMsg(msg: ActivityMessageModel) {
    let message = new CreateMessageModel(
      undefined,
      undefined,
      'delete',
      msg.id
    );
    this.messageService.SendMessage(message);
  }
  onScroll(event: any) {
    if (this.matCard.scrollTop < MIN_HEIGHT && this.activity) {
      this.store.dispatch(
        getMessages({
          parametr: {
            activity_id: this.activity.id,
            offset: this.messageOffset + 1,
          },
        })
      );
    }
  }
  sendMsg() {
    let value = this.msgCtrl.value;
    if (value && this.activity) {
      let message = new CreateMessageModel(value, this.activity.id);
      this.messageService.SendMessage(message);
    }
  }

  checkTab(event: any) {
    if (event == 0) {
      this.isMessagePage = true;
      this.croll();
    } else {
      this.isMessagePage = false;
    }
  }
}
