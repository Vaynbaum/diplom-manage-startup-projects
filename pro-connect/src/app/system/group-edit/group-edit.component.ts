import {
  approveInvitation,
  exitGroup,
  rejectInvitation,
} from './../../shared/store/activity/activity.actions';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AddGroupRoleModel,
  FullGroupModel,
  GroupRoleAssignModel,
  GroupRoleModel,
  GroupUser2Model,
  KickGroupUserModel,
  UpdateGroupModel,
  UpdateGroupRoleModel,
} from '../../shared/models/backend/group.models';
import { Observable } from 'rxjs';
import {
  ACTIVITY_PAGE,
  CONFIG_DIALOG,
  GROUP_PAGE,
  NAME_REDUCER_GROUP,
  NAME_REDUCER_PROFILE,
  PROFILE_PAGE,
  SYSTEM_MODULE,
} from '../../shared/consts';
import { Store } from '@ngrx/store';
import {
  ADD_CONTACT,
  CONTACT,
  CONTACTS,
  L_ENTER_UNAME,
  NO_CHANGE_CONTACTS,
  PARTS,
  PROFILE,
  SAVE_CONTACTS,
} from '../phrases';
import { DELETE, EDIT, SAVE_ICON } from '../../shared/phrases';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ADD_ICON,
  APPROVED,
  CANCEL_ICON,
  DEFAULT_AVA,
  DEFAULT_NO_PHOTO,
  DELETE_ICON,
  EDIT_ICON,
  INVALID,
  INVITE,
  MORE_VERT_ICON,
  NAME,
  NOTE,
  REJECTED,
  REQUEST,
  TYPE,
  UNAME,
} from '../consts';
import { ContactDialogModel } from '../../shared/models/special/contact';
import {
  AddContact,
  ContactGroupModel,
  ContactModel,
} from '../../shared/models/backend/contact.model';
import { OtherService } from '../../shared/services/other.service';
import {
  NameFormFieldInput,
  NoteFormFieldInput,
  TypeGroupFormFieldInput,
  UsernameFormFieldInput,
} from '../inputs';
import { GroupService } from '../../shared/services/group.service';
import { DialogContactAddComponent } from '../dialog/dialog-contact-add/dialog-contact-add.component';
import { MatDialog } from '@angular/material/dialog';
import {
  addRole,
  assignRole,
  createVacancy,
  deleteGroup,
  deleteRole,
  deleteVacancy,
  kickUser,
  loadGroup,
  updateGroup,
  updateRole,
  updateVacancy,
} from '../../shared/store/group/group.actions';
import { anySuccess } from '../../shared/store/common.effects';
import {
  commonDelete,
  compileId,
  compileURLImg,
  selectId,
  showMessage,
} from '../../shared/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogGroupRoleAddComponent } from '../dialog/dialog-group-role-add/dialog-group-role-add.component';
import { AvatarModel } from '../../shared/models/backend/avatar.model';
import { DialogAssignRoleComponent } from '../dialog/dialog-assign-role/dialog-assign-role.component';
import {
  CreateVacancyModel,
  UpdateVacancyModel,
  VacancyModel,
} from '../../shared/models/backend/vacancy.model';
import { DialogVacancyAddComponent } from '../dialog/dialog-vacancy-add/dialog-vacancy-add.component';
import {
  TagCreateIdModel,
  TagCreateNameModel,
  TagVacancyModel,
} from '../../shared/models/backend/tag.model';
import { DialogVacancyResponsesComponent } from '../dialog/dialog-vacancy-responses/dialog-vacancy-responses.component';
import { CommonTypeModel } from '../../shared/models/backend/type.model';
import {
  ActivityRequestAModel,
  CreateRequestModel,
} from '../../shared/models/backend/activity_request.model';
import { deleteRequest } from '../../shared/store/activity/activity.actions';
import {
  ActivityDBModel,
  ActivityModel,
} from '../../shared/models/backend/activity.model';
import {
  CreatePortfolioModel,
  PortfolioModel,
  PortfolioType,
  UpdatePortfolioModel,
} from '../../shared/models/backend/portfolio.model';
import { DialogPortfolioMoreComponent } from '../dialog/dialog-portfolio-more/dialog-portfolio-more.component';
import {
  addPortfolio,
  deletePortfolio,
  updatePortfolio,
} from '../../shared/store/portfolio/portfolio.actions';
import { DialogPortfolioAddComponent } from '../dialog/dialog-portfolio-add/dialog-portfolio-add.component';
import { PortfolioService } from '../../shared/services/portfolio.service';
import { DialogInviteAddComponent } from '../dialog/dialog-invite-add/dialog-invite-add.component';
import {
  UserAbstractDBModel,
  UserAbstractModel,
} from '../../shared/models/backend/user_abstract.model';
import { profileInitialState } from '../../shared/store/profile/profile.reducer';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss'],
})
export class GroupEditComponent implements OnInit, OnDestroy {
  group?: FullGroupModel;
  group$: Observable<FullGroupModel> = this.store.select(NAME_REDUCER_GROUP);
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);
  profile: UserAbstractModel = profileInitialState;
  contacts: ContactModel[] = [];
  groupRequests: ActivityRequestAModel[] = [];
  groupContacts: ContactDialogModel[] = [];
  backref = '';
  groupRoles: GroupRoleModel[] = [];
  allGroupRoles: GroupRoleModel[] = [];
  users: GroupUser2Model[] = [];
  vacancies: VacancyModel[] = [];
  portfolioTypes: PortfolioType[] = [];

  typeId?: number;
  profileSublock = {
    title: PROFILE,
    saveButton: { icon: SAVE_ICON, title: 'Сохранить данные' },
    deleteButton: { icon: DELETE_ICON, title: 'Удалить группу' },
    backButton: { icon: 'arrow_back', link: `/${SYSTEM_MODULE}/${GROUP_PAGE}` },
  };

  roleSublock = {
    title: 'Роли',
    addButton: { icon: ADD_ICON, title: 'Добавить роль' },
    deleteButton: { icon: CANCEL_ICON },
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
  partSublock = {
    title: PARTS,
    sendInvite: { title: 'Пригласить знакомых', icon: 'person_add' },
    menu: {
      icon: MORE_VERT_ICON,
      btns: [
        {
          icon: 'assignment',
          title: 'Назначить роль',
          actions: (user: GroupUser2Model) => this.assignRole(user),
        },
        {
          icon: 'person_remove',
          title: 'Изгнать',
          actions: (user: GroupUser2Model) => this.leaveUser(user),
        },
      ],
    },
  };

  vacancyBlock = {
    title: 'Вакансии',
    addButton: { icon: ADD_ICON, title: 'Добавить вакансию' },
    menu: {
      icon: MORE_VERT_ICON,
      btns: [
        {
          icon: 'query_stats',
          title: 'Просмотр окликов',
          actions: (vacancy: VacancyModel) => this.watchResponse(vacancy),
        },
        {
          icon: 'edit',
          title: 'Изменить',
          actions: (vacancy: VacancyModel) => this.editVacancy(vacancy),
        },
        {
          icon: 'delete',
          title: 'Удалить',
          actions: (vacancy: VacancyModel) => this.deleteVacancy(vacancy),
        },
      ],
    },
  };
  activityBlock = {
    title: 'Проекты группы',
    menu: {
      icon: MORE_VERT_ICON,
      btns: [
        {
          icon: 'logout',
          title: 'Выйти из проекта',
          actions: (act: ActivityModel) => this.exitGroup(act),
        },
      ],
    },
  };
  invateBlock = {
    title: 'Приглашения/заявки',
    menu: {
      icon: MORE_VERT_ICON,
      btns: [
        {
          icon: 'done',
          title: 'Одобрить',
          check: (req: ActivityRequestAModel) => {
            return req.status_id == INVITE && !req.activity.group_id;
          },
          actions: (req: ActivityRequestAModel) => this.approveInvitation(req),
        },
        {
          icon: 'swipe_left',
          title: 'Отклонить',
          check: (req: ActivityRequestAModel) => {
            return req.status_id == INVITE && !req.activity.group_id;
          },
          actions: (req: ActivityRequestAModel) => this.rejectInvitation(req),
        },
        {
          icon: 'delete',
          title: 'Удалить',
          check: (req: ActivityRequestAModel) => {
            return true;
          },
          actions: (req: ActivityRequestAModel) => this.deleteRequest(req),
        },
      ],
    },
  };
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

  styleStatusReq(req: ActivityRequestAModel) {
    let color = 'blue';
    if (req.status_id == INVALID || req.status_id == REJECTED) color = 'red';
    else if (req.status_id == APPROVED) color = 'green';
    return { color: color };
  }

  constructor(
    private store: Store<{ group: FullGroupModel; profile: UserAbstractModel }>,
    private route: ActivatedRoute,
    private otherService: OtherService,
    private portfolioService: PortfolioService,
    private groupService: GroupService,
    private injector: Injector,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  subGroup: any;
  ps: any;
  ngOnDestroy(): void {
    this.subGroup.unsubscribe();
    this.ps.unsubscribe();
  }
  ngOnInit() {
    this.ps = this.profile$?.subscribe((profile: UserAbstractModel) => {
      this.profile = profile;
    });
    this.loadType();

    this.route.queryParams.subscribe((params: Params) => {
      this.backref = params['backref'];
    });
    this.portfolioService.GetAllTypes().subscribe((types) => {
      this.portfolioTypes = types;
    });
    this.subGroup = this.group$?.subscribe((res: FullGroupModel) => {
      this.group = res;
      this.setField(UNAME, this.group.username);
      this.setField(NAME, this.group.name);
      this.setField(NOTE, this.group.note);
      this.setField(TYPE, this.group.type.name);
      this.setTypeId();
      this.compileGroupContacts();
      this.compileGroupUsers();
      this.compileVacancies();

      if (this.group.id != -1) this.loadRoles(this.group.id);

      let url = `/${SYSTEM_MODULE}/${GROUP_PAGE}/${this.backref}`;
      if (!this.backref)
        url = `/${SYSTEM_MODULE}/${GROUP_PAGE}/${selectId(this.group)}`;
      this.profileSublock.backButton.link = url;
    });

    this.otherService.GetContacts().subscribe((contacts) => {
      this.contacts = contacts;
    });
  }

  form = new FormGroup({
    username: new FormControl(this.group?.username),
    name: new FormControl(this.group?.name, [Validators.required]),
    note: new FormControl(this.group?.note),
    type: new FormControl(this.group?.type.name, [Validators.required]),
  });

  inputs = [
    new UsernameFormFieldInput(this.form, L_ENTER_UNAME, 'nickname'),
    new NameFormFieldInput(this.form),
    new NoteFormFieldInput(this.form),
  ];
  approveInvitation(req: ActivityRequestAModel) {
    let d = new CreateRequestModel(req.group_id, req.activity_id);
    this.store.dispatch(approveInvitation({ parametr: d }));
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.backref = '';
      this.store.dispatch(loadGroup({ parametr: compileId(this.group?.id) }));
    });
  }
  rejectInvitation(req: ActivityRequestAModel) {
    let d = new CreateRequestModel(req.group_id, req.activity_id);
    this.store.dispatch(rejectInvitation({ parametr: d }));
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.backref = '';
      this.store.dispatch(loadGroup({ parametr: compileId(this.group?.id) }));
    });
  }
  exitGroup(act: ActivityModel) {
    if (act.group_id) {
      let d = new CreateRequestModel(act.group_id, act.id);
      this.store.dispatch(exitGroup({ parametr: d }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.backref = '';
        this.store.dispatch(loadGroup({ parametr: compileId(this.group?.id) }));
      });
    }
  }
  goToActivity(act: ActivityDBModel | ActivityModel) {
    let url = `/${SYSTEM_MODULE}/${ACTIVITY_PAGE}/${act.id}`;
    this.router.navigate([url]);
  }

  deleteRequest(req: ActivityRequestAModel) {
    if (this.group) {
      let d = new CreateRequestModel(this.group.id, req.activity_id);
      this.store.dispatch(deleteRequest({ parametr: d }));
      commonDelete(this.groupRequests, req);
    }
  }

  typeInput = new TypeGroupFormFieldInput(this.form);

  assignRole(user: GroupUser2Model) {
    const dialogRef = this.dialog.open(DialogAssignRoleComponent, {
      ...CONFIG_DIALOG,
      data: {
        roles: this.allGroupRoles,
        user: user,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let ass = new GroupRoleAssignModel(
          this.group?.id,
          result.user.id,
          result.role.id
        );
        this.store.dispatch(assignRole({ parametr: ass }));
      }
    });
  }

  checkChange(skill: TagVacancyModel, tags?: TagVacancyModel[]) {
    if (tags) {
      let res = tags.filter(
        (t) => t.level?.id == skill.level?.id && t.tag?.id == skill.tag?.id
      );
      return !(res.length > 0);
    }
    return true;
  }

  selectTags(vacancy: VacancyModel, ts: any[] = []) {
    let tags: TagCreateIdModel[] = [];
    let tag_names: TagCreateNameModel[] = [];
    let deleteds: number[] = [];

    vacancy?.tags?.forEach((tag) => {
      if (this.checkChange(tag, ts)) {
        if (tag.tag?.id == -1 && tag.level?.id) {
          let tagName = new TagCreateNameModel(tag.tag.name, tag.level.id);
          tag_names.push(tagName);
        } else if (tag.tag?.id && tag.level?.id) {
          let tagId = new TagCreateIdModel(tag.tag?.id, tag.level.id);
          tags.push(tagId);
        }
      }
    });

    if (ts) {
      ts.forEach((t) => {
        let res = vacancy.tags?.filter((ta) => t.tag.id == ta.tag?.id);
        if (res && res.length == 0) {
          deleteds.push(t.tag.id);
        }
      });
    }
    return { tags, tag_names, deleteds };
  }

  addVacancy() {
    if (this.group) {
      let vac = new VacancyModel(
        -1,
        new Date(),
        '',
        this.group.id,
        true,
        '',
        []
      );
      const dialogRef = this.dialog.open(DialogVacancyAddComponent, {
        ...CONFIG_DIALOG,
        data: {
          vacancy: vac,
        },
      });

      dialogRef
        .afterClosed()
        .subscribe((result: { oldTags: any[]; vacancy: VacancyModel }) => {
          if (result.vacancy) {
            this.vacancies.push(result.vacancy);
            let r = this.selectTags(result.vacancy, result.oldTags);
            let v = new CreateVacancyModel(
              result.vacancy.name,
              result.vacancy.description as string,
              result.vacancy.group_id,
              r.tags,
              r.tag_names
            );

            this.store.dispatch(createVacancy({ parametr: v }));
            let sub = anySuccess.subscribe((res) => {
              sub.unsubscribe();
              this.backref = '';
              this.store.dispatch(
                loadGroup({ parametr: compileId(this.group?.id) })
              );
            });
          }
        });
    }
  }

  editVacancy(vacancy: VacancyModel) {
    const dialogRef = this.dialog.open(DialogVacancyAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        vacancy: vacancy,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: { oldTags: any[]; vacancy: VacancyModel }) => {
        if (result) {
          let r = this.selectTags(result.vacancy, result.oldTags);
          let v = new UpdateVacancyModel(
            result.vacancy.name,
            result.vacancy.description as string,
            result.vacancy.id,
            result.vacancy.is_active,
            r.tags,
            r.tag_names,
            r.deleteds
          );
          this.store.dispatch(updateVacancy({ parametr: v }));
          let sub = anySuccess.subscribe((res) => {
            sub.unsubscribe();
            this.backref = '';
            this.store.dispatch(
              loadGroup({ parametr: compileId(this.group?.id) })
            );
          });
        }
      });
  }

  watchResponse(vacancy: VacancyModel) {
    let c = structuredClone(CONFIG_DIALOG);
    c.maxWidth = '600px';
    this.dialog.open(DialogVacancyResponsesComponent, {
      ...c,
      data: {
        vacancy: vacancy,
      },
    });
  }

  deleteVacancy(vacancy: VacancyModel) {
    commonDelete(this.vacancies, vacancy);
    this.store.dispatch(deleteVacancy({ parametr: vacancy.id }));
  }

  leaveUser(user: GroupUser2Model) {
    let kick = new KickGroupUserModel(this.group?.id, user.user.id);
    this.store.dispatch(kickUser({ parametr: kick }));
    commonDelete(this.users, user);
  }

  setTypeId() {
    let id = this.group?.type_id;
    if (id && id > 0) this.typeId = id;
  }

  loadRoles(id: number) {
    this.groupRoles = [];
    this.allGroupRoles = [];

    this.groupService.GetRoles(id).subscribe((roles) => {
      roles.forEach((role) => {
        this.allGroupRoles.push(role);
        if (role.is_common == false) this.groupRoles.push(role);
      });
    });
  }

  loadType() {
    this.typeInput.loadingData();
    this.groupService.GetAllTypes().subscribe(
      (result) => {
        this.typeInput.loadData(result);
      },
      (err) => {}
    );
  }

  compileGroupContacts() {
    this.groupContacts = [];
    this.group?.contacts?.forEach((contact) => {
      let v = `${contact.contact?.title}: ${contact.value}`;
      let formControl = new FormControl(v);
      let c = new ContactDialogModel(contact, formControl);
      this.groupContacts.push(c);
    });
  }
  compileGroupUsers() {
    this.users = JSON.parse(JSON.stringify(this.group?.users));
  }
  compileVacancies() {
    this.vacancies = JSON.parse(JSON.stringify(this.group?.vacancies));
    this.groupRequests = JSON.parse(JSON.stringify(this.group?.requests));
  }
  setField(path: string, value: any) {
    this.form.get(path)?.setValue(value);
  }
  selectCity(type: CommonTypeModel) {
    this.typeId = type.id;
  }
  isActiveWord(is_active: boolean) {
    return is_active ? 'Открыта' : 'Закрыта';
  }
  styleIsActive(is_active: boolean) {
    return { color: is_active ? 'green' : 'blue' };
  }

  deleteGroup() {
    if (this.group) {
      this.store.dispatch(deleteGroup({ parametr: this.group.id }));
    }
  }

  saveGroup() {
    const { username, name, note, type } = this.form.value;

    let id = this.group?.id;
    let typeId = this.group?.type_id;
    if (type) typeId = this.typeId;

    let group = new UpdateGroupModel(id, username, name, note, typeId);

    this.store.dispatch(updateGroup({ parametr: group }));
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.backref = '';
      this.store.dispatch(loadGroup({ parametr: compileId(id) }));
    });
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
    commonDelete(this.groupContacts, contact);
  }
  addContact() {
    let link = new ContactGroupModel('');
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
        this.groupContacts.push(result);
      }
    });
  }
  saveContacts() {
    let id = this.group?.id;
    let addContacts: AddContact[] = [];
    let deleteContacts: number[] = [];

    this.group?.contacts?.forEach((contact) => {
      let arr = this.groupContacts.filter((c) => c.link?.id === contact.id);
      if (arr.length == 0 && contact.id) deleteContacts.push(contact.id);
    });

    this.groupContacts.forEach((contact) => {
      if (!contact.link.id && contact.link.contact) {
        let c = new AddContact(contact.link.contact.id, contact.link.value);
        addContacts.push(c);
      }
    });

    if (this.checkChangeContSkills(addContacts, deleteContacts)) {
      let group = new UpdateGroupModel(
        id,
        undefined,
        undefined,
        undefined,
        undefined,
        addContacts,
        deleteContacts
      );
      this.store.dispatch(updateGroup({ parametr: group }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.backref = '';
        this.store.dispatch(loadGroup({ parametr: compileId(id) }));
      });
    } else showMessage(this._snackBar, NO_CHANGE_CONTACTS);
  }

  checkChangeContSkills(arr1: any[], arr2: any[]) {
    return arr1.length > 0 || arr2.length > 0;
  }

  addRole() {
    let role = new GroupRoleModel(-1, '', false);
    const dialogRef = this.dialog.open(DialogGroupRoleAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        role: role,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.groupRoles.push(result);
        this.allGroupRoles.push(result);
        let r = new AddGroupRoleModel(this.group?.id, result.name);
        this.store.dispatch(addRole({ parametr: r }));
        let sub = anySuccess.subscribe((res) => {
          sub.unsubscribe();
          this.backref = '';
          this.store.dispatch(
            loadGroup({ parametr: compileId(this.group?.id) })
          );
        });
      }
    });
  }
  deleteRole(role: GroupRoleModel) {
    this.store.dispatch(deleteRole({ parametr: role.id }));
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.store.dispatch(loadGroup({ parametr: compileId(this.group?.id) }));
    });
  }

  urlAvatar(avatar?: AvatarModel | null, isUser = false) {
    let defaul = isUser ? DEFAULT_AVA : DEFAULT_NO_PHOTO;
    return compileURLImg(avatar ? avatar.url : null, defaul);
  }
  editRole(role: GroupRoleModel) {
    const dialogRef = this.dialog.open(DialogGroupRoleAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        role: role,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let r = new UpdateGroupRoleModel(result.id, result.name);
        this.store.dispatch(updateRole({ parametr: r }));
      }
    });
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
          this.store.dispatch(
            loadGroup({ parametr: compileId(this.group?.id) })
          );
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
          this.group?.id,
          undefined,
          p.getted_at,
          result.tags,
          result.tag_names,
          mat
        );
        let sub = anySuccess.subscribe((res) => {
          sub.unsubscribe();
          this.store.dispatch(
            loadGroup({ parametr: compileId(this.group?.id) })
          );
          showMessage(this._snackBar, 'Достижение добавлено');
        });
        this.store.dispatch(addPortfolio({ parametr: data }));
      }
    });
  }

  deletePortfolio(portfolio: PortfolioModel) {
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.store.dispatch(loadGroup({ parametr: compileId(this.group?.id) }));
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

  addInvite() {
    if (this.profile.user) {
      let freinds = this.profile.user.subscribers?.map((s) => s.subscriber);
      this.profile.user.favorites?.forEach((fa) => {
        if (!freinds?.find((f) => f?.id == fa.favorite?.id))
          freinds?.push(fa.favorite);
      });
      this.dialog.open(DialogInviteAddComponent, {
        ...CONFIG_DIALOG,
        data: { freinds: freinds, group_id: this.group?.id },
      });
    }
  }

  goToUser(user: UserAbstractDBModel) {
    let id = selectId(user);
    let url = `/${SYSTEM_MODULE}/${PROFILE_PAGE}/${id}`;
    this.router.navigate([url]);
  }
}
