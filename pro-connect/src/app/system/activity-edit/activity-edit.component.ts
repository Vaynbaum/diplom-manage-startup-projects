import { CommonStatusModel } from './../../shared/models/backend/status.model';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import {
  ADD_CONTACT,
  CONTACTS,
  NO_CHANGE_CONTACTS,
  PROFILE,
  SAVE_CONTACTS,
} from '../phrases';
import { DELETE, EDIT, SAVE_ICON } from '../../shared/phrases';
import {
  ADD_ICON,
  APPROVED,
  CANCEL_ICON,
  CONTACT,
  DEFAULT_NO_PHOTO,
  DELETE_ICON,
  EDIT_ICON,
  INVALID,
  MORE_VERT_ICON,
  NAME,
  NOTE,
  REJECTED,
  REQUEST,
  STATUS,
} from '../consts';
import {
  ACTIVITY_PAGE,
  CONFIG_DIALOG,
  GROUP_PAGE,
  NAME_REDUCER_ACTIVITY,
  SYSTEM_MODULE,
} from '../../shared/consts';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OtherService } from '../../shared/services/other.service';
import { ActivityService } from '../../shared/services/activity.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  DirectionModel,
  FullActivityModel,
  UpdateActivityModel,
} from '../../shared/models/backend/activity.model';
import {
  DirectionFormFieldInput,
  NameFormFieldInput,
  NoteFormFieldInput,
  StatusActFormFieldInput,
} from '../inputs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  addActivityTag,
  approveRequest,
  deleteActivity,
  deleteActivityTag,
  deleteInvitation,
  kickGroup,
  loadActivity,
  rejectRequest,
  updateActivity,
} from '../../shared/store/activity/activity.actions';
import { anySuccess } from '../../shared/store/common.effects';
import { ContactDialogModel } from '../../shared/models/special/contact';
import { DialogContactAddComponent } from '../dialog/dialog-contact-add/dialog-contact-add.component';
import {
  commonDelete,
  compileURLImg,
  selectId,
  showMessage,
} from '../../shared/functions';
import {
  AddContact,
  ContactActivityModel,
  ContactModel,
} from '../../shared/models/backend/contact.model';
import {
  DeleteActivityTag,
  ShortTagCreateIdModel,
  ShortTagCreateModel,
  ShortTagCreateNameModel,
  TagActivityModel,
} from '../../shared/models/backend/tag.model';
import { DialogTagAddComponent } from '../dialog/dialog-tag-add/dialog-tag-add.component';
import {
  ActivityRequestGModel,
  CreateRequestModel,
} from '../../shared/models/backend/activity_request.model';
import { AvatarModel } from '../../shared/models/backend/avatar.model';
import {
  GroupDBModel,
  GroupWithTypeModel,
} from '../../shared/models/backend/group.models';
import {
  CreatePortfolioModel,
  PortfolioModel,
  PortfolioType,
  UpdatePortfolioModel,
} from '../../shared/models/backend/portfolio.model';
import {
  addPortfolio,
  deletePortfolio,
  updatePortfolio,
} from '../../shared/store/portfolio/portfolio.actions';
import { DialogPortfolioMoreComponent } from '../dialog/dialog-portfolio-more/dialog-portfolio-more.component';
import { DialogPortfolioAddComponent } from '../dialog/dialog-portfolio-add/dialog-portfolio-add.component';
import { PortfolioService } from '../../shared/services/portfolio.service';

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component.scss'],
})
export class ActivityEditComponent implements OnInit, OnDestroy {
  contacts: ContactModel[] = [];
  activityContacts: ContactDialogModel[] = [];
  activityTags: TagActivityModel[] = [];
  activityRequests: ActivityRequestGModel[] = [];
  activity?: FullActivityModel;
  activity$: Observable<FullActivityModel> = this.store.select(
    NAME_REDUCER_ACTIVITY
  );
  portfolioTypes: PortfolioType[] = [];

  profileSublock = {
    title: PROFILE,
    saveButton: { icon: SAVE_ICON, title: 'Сохранить данные' },
    deleteButton: { icon: DELETE_ICON, title: 'Удалить проект' },
    backButton: {
      icon: 'arrow_back',
      link: `/${SYSTEM_MODULE}/${ACTIVITY_PAGE}`,
    },
  };
  contactSublock = {
    title: CONTACTS,
    saveButton: { icon: SAVE_ICON, title: SAVE_CONTACTS },
    addButton: { icon: ADD_ICON, title: ADD_CONTACT },
    field: CONTACT,
    menu: {
      icon: MORE_VERT_ICON,
      btns: [
        {
          icon: EDIT_ICON,
          title: EDIT,
          actions: (contact: ContactDialogModel) => {
            this.editContact(contact);
          },
        },
        {
          icon: DELETE_ICON,
          title: DELETE,
          actions: (contact: ContactDialogModel) => {
            this.deleteContact(contact);
          },
        },
      ],
    },
  };
  roleSublock = {
    title: 'Теги',
    addButton: { icon: ADD_ICON, title: 'Добавить тег' },
    deleteButton: { icon: CANCEL_ICON },
  };
  statusId?: number;
  invateBlock = {
    title: 'Приглашения/заявки',
    menu: {
      icon: MORE_VERT_ICON,
      btns: [
        {
          icon: 'done',
          title: 'Одобрить',
          check: (req: ActivityRequestGModel) => {
            return req.status_id == REQUEST;
          },
          actions: (req: ActivityRequestGModel) => this.approveRequest(req),
        },
        {
          icon: 'swipe_left',
          title: 'Отклонить',
          check: (req: ActivityRequestGModel) => {
            return req.status_id == REQUEST;
          },
          actions: (req: ActivityRequestGModel) => this.rejectRequest(req),
        },
        {
          icon: 'delete',
          title: 'Удалить',
          check: (req: ActivityRequestGModel) => {
            return true;
          },
          actions: (req: ActivityRequestGModel) => this.deleteRequest(req),
        },
      ],
    },
  };
  groupBlock = {
    title: 'Группа в проекте',
    kickGroupBtn: { title: 'Изгнать группу', icon: 'heart_broken' },
  };
  selectedDirection?: DirectionModel;

  portBtnEdit = {
    icon: EDIT_ICON,
    title: EDIT,
    actions: (contact: PortfolioModel) => {
      this.editPortfolio(contact);
    },
  };
  portBtnDelete = {
    icon: DELETE_ICON,
    title: DELETE,
    actions: (contact: PortfolioModel) => {
      this.deletePortfolio(contact);
    },
  };
  portfolioSublock = {
    title: 'Достижения',
    menu: {
      icon: MORE_VERT_ICON,
      btns: [this.portBtnEdit, this.portBtnDelete],
    },
    addButton: { icon: ADD_ICON, title: 'Добавить достижение' },
  };

  form = new FormGroup({
    name: new FormControl(this.activity?.name, [Validators.required]),
    note: new FormControl(this.activity?.description),
    direction: new FormControl(this.activity?.direction?.name, [
      Validators.required,
    ]),
    status: new FormControl(this.activity?.status.name, [Validators.required]),
  });
  inputs = [
    new NameFormFieldInput(this.form),
    new NoteFormFieldInput(this.form),
  ];
  directionInput = new DirectionFormFieldInput(this.form);
  typeInput = new StatusActFormFieldInput(this.form);
  backref = '';

  constructor(
    private store: Store<{ activity: FullActivityModel }>,
    private route: ActivatedRoute,
    private otherService: OtherService,
    private portfolioService: PortfolioService,
    private injector: Injector,
    private activityService: ActivityService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  subAct: any;
  ngOnDestroy(): void {
    this.subAct.unsubscribe();
  }
  selectDirection(direction: DirectionModel) {
    this.selectedDirection = direction;
  }
  loadDirections() {
    this.directionInput.loadingData();
    this.activityService.GetAllDirections().subscribe(
      (result) => {
        this.directionInput.loadData(result);
      },
      (err) => {}
    );
  }
  loadType() {
    this.typeInput.loadingData();
    this.activityService.GetAllStatuses().subscribe(
      (result) => {
        this.typeInput.loadData(result);
      },
      (err) => {}
    );
  }
  setTypeId() {
    let id = this.activity?.status_id;
    if (id && id > 0) this.statusId = id;
  }
  approveRequest(req: ActivityRequestGModel) {
    let d = new CreateRequestModel(req.group_id, req.activity_id);
    this.store.dispatch(approveRequest({ parametr: d }));
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.backref = '';
      if (this.activity)
        this.store.dispatch(loadActivity({ parametr: this.activity.id }));
    });
  }
  rejectRequest(req: ActivityRequestGModel) {
    let d = new CreateRequestModel(req.group_id, req.activity_id);
    this.store.dispatch(rejectRequest({ parametr: d }));
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.backref = '';
      if (this.activity)
        this.store.dispatch(loadActivity({ parametr: this.activity.id }));
    });
  }
  kickGroup() {
    if (this.activity?.group) {
      let d = new CreateRequestModel(this.activity.group.id, this.activity.id);
      this.store.dispatch(kickGroup({ parametr: d }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.backref = '';
        if (this.activity)
          this.store.dispatch(loadActivity({ parametr: this.activity.id }));
      });
    }
  }
  goToGroup(group?: GroupDBModel | GroupWithTypeModel | null) {
    if (group) {
      let url = `/${SYSTEM_MODULE}/${GROUP_PAGE}/${selectId(group)}`;
      this.router.navigate([url]);
    }
  }
  deleteRequest(req: ActivityRequestGModel) {
    if (this.activity) {
      let d = new CreateRequestModel(req.group_id, this.activity.id);
      this.store.dispatch(deleteInvitation({ parametr: d }));
      commonDelete(this.activityRequests, req);
    }
  }
  ngOnInit() {
    this.loadType();
    this.loadDirections();
    this.portfolioService.GetAllTypes().subscribe((types) => {
      this.portfolioTypes = types;
    });
    this.route.queryParams.subscribe((params: Params) => {
      this.backref = params['backref'];
    });

    this.subAct = this.activity$?.subscribe((res: FullActivityModel) => {
      this.activity = res;
      if (this.activity) {
        this.setField(NAME, this.activity.name);
        this.setField(NOTE, this.activity.description);
        this.setField(STATUS, this.activity.status.name);
        this.setField('direction', this.activity?.direction?.name);
        this.setTypeId();
        this.compileActivityContacts();
        this.compileActivityTags();
      }

      let url = `/${SYSTEM_MODULE}/${ACTIVITY_PAGE}/${this.backref}`;
      if (!this.backref)
        url = `/${SYSTEM_MODULE}/${ACTIVITY_PAGE}/${this.activity.id}`;
      this.profileSublock.backButton.link = url;
    });

    this.otherService.GetContacts().subscribe((contacts) => {
      this.contacts = contacts;
    });
  }
  compileActivityContacts() {
    this.activityContacts = [];
    this.activity?.contacts?.forEach((contact) => {
      let v = `${contact.contact?.title}: ${contact.value}`;
      let formControl = new FormControl(v);
      let c = new ContactDialogModel(contact, formControl);
      this.activityContacts.push(c);
    });
  }
  selectCity(type: CommonStatusModel) {
    this.statusId = type.id;
  }
  setField(path: string, value: any) {
    this.form.get(path)?.setValue(value);
  }
  deleteActivity() {
    if (this.activity) {
      this.store.dispatch(deleteActivity({ parametr: this.activity.id }));
    }
  }

  saveActivity() {
    const { name, note, status, direction } = this.form.value;
    let id = this.activity?.id;

    if (id && name && note) {
      let statusId = this.activity?.status_id;
      if (status) statusId = this.statusId;
      let activity = new UpdateActivityModel(
        id,
        name,
        note,
        statusId,
        this.selectedDirection?.id
      );

      this.store.dispatch(updateActivity({ parametr: activity }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.backref = '';
        //@ts-ignore
        this.store.dispatch(loadActivity({ parametr: id }));
      });
    }
  }
  compileActivityTags() {
    if (this.activity?.tags)
      this.activityTags = JSON.parse(JSON.stringify(this.activity.tags));
    this.activityRequests = JSON.parse(JSON.stringify(this.activity?.requests));
  }
  editContact(contact: ContactDialogModel) {
    this.dialog.open(DialogContactAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        contact: contact,
        types: this.contacts,
      },
    });
  }

  deleteContact(contact: ContactDialogModel) {
    commonDelete(this.activityContacts, contact);
  }
  addContact() {
    let link = new ContactActivityModel('');
    let formControl = new FormControl();
    let c = new ContactDialogModel(link, formControl);
    const dialogRef = this.dialog.open(DialogContactAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        contact: c,
        types: this.contacts,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.activityContacts.push(result);
      }
    });
  }
  saveContacts() {
    let id = this.activity?.id;
    let addContacts: AddContact[] = [];
    let deleteContacts: number[] = [];

    if (id) {
      this.activity?.contacts?.forEach((contact) => {
        let arr = this.activityContacts.filter(
          (c) => c.link?.id === contact.id
        );
        if (arr.length == 0 && contact.id) deleteContacts.push(contact.id);
      });

      this.activityContacts.forEach((contact) => {
        if (!contact.link.id && contact.link.contact) {
          let c = new AddContact(contact.link.contact.id, contact.link.value);
          addContacts.push(c);
        }
      });

      if (this.checkChangeContSkills(addContacts, deleteContacts)) {
        let group = new UpdateActivityModel(
          id,
          undefined,
          undefined,
          undefined,
          undefined,
          addContacts,
          deleteContacts
        );
        this.store.dispatch(updateActivity({ parametr: group }));
        let sub = anySuccess.subscribe((res) => {
          sub.unsubscribe();
          this.backref = '';
          //@ts-ignore
          this.store.dispatch(loadActivity({ parametr: id }));
        });
      } else showMessage(this._snackBar, NO_CHANGE_CONTACTS);
    }
  }
  urlAvatar(avatar?: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_NO_PHOTO);
  }
  checkChangeContSkills(arr1: any[], arr2: any[]) {
    return arr1.length > 0 || arr2.length > 0;
  }
  styleStatusReq(req: ActivityRequestGModel) {
    let color = 'blue';
    if (req.status_id == INVALID || req.status_id == REJECTED) color = 'red';
    else if (req.status_id == APPROVED) color = 'green';
    return { color: color };
  }
  addTag() {
    let tag = new TagActivityModel(null);
    const dialogRef = this.dialog.open(DialogTagAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        tag: tag,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let id = this.activity?.id;
        if (id) {
          this.activityTags.push(result);
          let d = new ShortTagCreateModel(id);

          if (result.tag.id == -1)
            d.tag_names = [new ShortTagCreateNameModel(result.tag.name)];
          else d.tags = [new ShortTagCreateIdModel(result.tag.id)];
          this.store.dispatch(addActivityTag({ parametr: d }));
          let sub = anySuccess.subscribe((res) => {
            sub.unsubscribe();
            this.backref = '';
            //@ts-ignore
            this.store.dispatch(loadActivity({ parametr: id }));
          });
        }
      }
    });
  }
  deleteTag(tag: TagActivityModel) {
    if (this.activity && tag.tag) {
      let d = new DeleteActivityTag(this.activity.id, tag.tag.id);
      this.store.dispatch(deleteActivityTag({ parametr: d }));
      commonDelete(this.activityTags, tag);
    }
  }

  editPortfolio(portfolio: PortfolioModel) {
    const dialogRef = this.dialog.open(DialogPortfolioAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        types: this.portfolioTypes,
        portfolio: portfolio,
      },
      injector: this.injector,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let p = result.portfolio;
        let deleteFile = undefined;
        if (portfolio.material && portfolio.material != p.material) {
          // console.log(portfolio.material, p.material);
          deleteFile = portfolio.material.img
            ? portfolio.material.img.id
            : portfolio.material.file?.id;
        }
        let mat = null;
        if (p.material) {
          mat = p.material.img ? p.material.img : p.material.file;
        }
        let data = new UpdatePortfolioModel(
          portfolio.id,
          p.name,
          p.value,
          p.note,
          p.type_id,
          p.getted_at,
          result.tags,
          result.tag_names,
          result.deleteds,
          mat,
          deleteFile
        );
        let sub = anySuccess.subscribe((res) => {
          sub.unsubscribe();
          if (this.activity)
            this.store.dispatch(loadActivity({ parametr: this.activity.id }));
          showMessage(this._snackBar, 'Достижение изменено');
        });
        this.store.dispatch(updatePortfolio({ parametr: data }));
      }
    });
  }

  addPortfolio() {
    let portfolio = new PortfolioModel(-1, '', -1);
    const dialogRef = this.dialog.open(DialogPortfolioAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        types: this.portfolioTypes,
        portfolio: portfolio,
      },
      injector: this.injector,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let p = result.portfolio;
        let mat = null;
        if (p.material) {
          mat = p.material.img ? p.material.img : p.material.file;
        }
        let data = new CreatePortfolioModel(
          p.name,
          p.value,
          p.note,
          p.type_id,
          undefined,
          this.activity?.id,
          p.getted_at,
          result.tags,
          result.tag_names,
          mat
        );
        let sub = anySuccess.subscribe((res) => {
          sub.unsubscribe();
          if (this.activity)
            this.store.dispatch(loadActivity({ parametr: this.activity.id }));
          showMessage(this._snackBar, 'Достижение добавлено');
        });
        this.store.dispatch(addPortfolio({ parametr: data }));
      }
    });
  }

  deletePortfolio(portfolio: PortfolioModel) {
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      if (this.activity)
        this.store.dispatch(loadActivity({ parametr: this.activity.id }));
      showMessage(this._snackBar, 'Достижение удалено');
    });
    this.store.dispatch(deletePortfolio({ parametr: portfolio.id }));
  }

  openPortfolio(portfolio: PortfolioModel) {
    let c = structuredClone(CONFIG_DIALOG);
    c.maxWidth = '700px';
    this.dialog.open(DialogPortfolioMoreComponent, {
      ...c,
      data: { portfolio: portfolio },
    });
  }
}
