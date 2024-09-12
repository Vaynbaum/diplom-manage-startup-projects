import {
  ADD_ICON,
  CANCEL_ICON,
  DEFAULT_AVA,
  DEFAULT_NO_PHOTO,
  DELETE_ICON,
  EDIT_ICON,
  MORE_VERT_ICON,
} from './../consts';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  GroupInviteWithGroupModel,
  UpdateUserModel,
  Vacancy2UserModel,
} from '../../shared/models/backend/user.model';
import { Observable } from 'rxjs';
import {
  ADMIN_ROLE_ID,
  CONFIG_DIALOG,
  FNAME,
  GROUP_PAGE,
  LINK_PAGE_PROFILE,
  LNAME,
  MIN_LENGTH_SUBSTR,
  NAME_REDUCER_PROFILE,
  SYSTEM_MODULE,
} from '../../shared/consts';
import { profileInitialState } from '../../shared/store/profile/profile.reducer';
import {
  FirstnameFormFieldInput,
  LastnameFormFieldInput,
} from '../../shared/inputs';
import {
  BirthdayFormFieldInput,
  CityFormFieldInput,
  RegionFormFieldInput,
  UsernameFormFieldInput,
} from '../inputs';
import { BIRTHDATE, CITY, FORMAT_DATE, LOCALE_RU, UNAME } from '../consts';
import { OtherService } from '../../shared/services/other.service';
import {
  CityModel,
  CityUpdateModel,
  RegionModel,
} from '../../shared/models/backend/city.model';
import {
  AddContact,
  ContactModel,
  ContactUserModel,
} from '../../shared/models/backend/contact.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogContactAddComponent } from '../dialog/dialog-contact-add/dialog-contact-add.component';
import { ContactDialogModel } from '../../shared/models/special/contact';
import {
  ADD_CONTACT,
  ADD_SKILL,
  CONTACT,
  CONTACTS,
  NO_CHANGE_CONTACTS,
  NO_CHANGE_SKILLS,
  PROFILE,
  SAVE_CONTACTS,
  SAVE_PROFILE,
  SAVE_SKILLS,
  SKILLS,
} from '../phrases';
import { DELETE, EDIT, SAVE_ICON } from '../../shared/phrases';
import {
  deleteUser,
  loadMyProfile,
  updateProfile,
} from '../../shared/store/profile/profile.actions';
import { formatDate } from '@angular/common';
import { DialogSkillAddComponent } from '../dialog/dialog-skill-add/dialog-skill-add.component';
import { addTag, deleteTag } from '../../shared/store/tag/tag.actions';
import {
  TagCreateIdModel,
  TagCreateModel,
  TagCreateNameModel,
  TagLevelModel,
  TagUserModel,
} from '../../shared/models/backend/tag.model';
import { TagService } from '../../shared/services/tag.service';
import {
  commonDelete,
  compileURLImg,
  selectId,
  showMessage,
} from '../../shared/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAbstractModel } from '../../shared/models/backend/user_abstract.model';
import { anySuccess } from '../../shared/store/common.effects';
import { DialogResetEmailComponent } from '../dialog/dialog-reset-email/dialog-reset-email.component';
import { DialogResetPasswordComponent } from '../dialog/dialog-reset-password/dialog-reset-password.component';
import { DialogPortfolioAddComponent } from '../dialog/dialog-portfolio-add/dialog-portfolio-add.component';
import {
  CreatePortfolioModel,
  PortfolioModel,
  PortfolioType,
  UpdatePortfolioModel,
} from '../../shared/models/backend/portfolio.model';
import { PortfolioService } from '../../shared/services/portfolio.service';
import {
  addPortfolio,
  deletePortfolio,
  updatePortfolio,
} from '../../shared/store/portfolio/portfolio.actions';
import { DialogPortfolioMoreComponent } from '../dialog/dialog-portfolio-more/dialog-portfolio-more.component';
import { AvatarModel } from '../../shared/models/backend/avatar.model';
import { GroupDBModel } from '../../shared/models/backend/group.models';
import { Router } from '@angular/router';
import {
  deleteInvite,
  deleteVacancyResponse,
  putInvite,
} from '../../shared/store/group/group.actions';
import { ResponseInviteModel } from '../../shared/models/backend/response_invite.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  responseSublock = { title: 'Отклики на вакансии', btn: { icon: 'delete' } };
  appInviteBtn = {
    title: 'Принять',
    icon: 'done',
    actions: (invite: GroupInviteWithGroupModel) => {
      this.appInvite(invite);
    },
    check: (invite: GroupInviteWithGroupModel) => {
      return invite.is_approved == null;
    },
  };
  rejInviteBtn = {
    title: 'Отклонить',
    icon: 'swipe_left',
    actions: (invite: GroupInviteWithGroupModel) => {
      this.rejInvite(invite);
    },
    check: (invite: GroupInviteWithGroupModel) => {
      return invite.is_approved == null;
    },
  };
  delInviteBtn = {
    title: 'Удалить',
    icon: 'delete',
    actions: (invite: GroupInviteWithGroupModel) => {
      this.delInvite(invite);
    },
    check: (_: GroupInviteWithGroupModel) => {
      return true;
    },
  };
  inviteresponseSublock = {
    title: 'Приглашения',
    menu: {
      icon: MORE_VERT_ICON,
      btns: [this.appInviteBtn, this.rejInviteBtn, this.delInviteBtn],
    },
  };
  profileSublock = {
    title: PROFILE,
    saveButton: { icon: SAVE_ICON, title: SAVE_PROFILE },
    backButton: { icon: 'arrow_back', link: LINK_PAGE_PROFILE },
  };
  deleteProfileBtn = {
    icon: 'person_remove',
    title: 'Удалить профиль',
  };
  changePasswordBtn = {
    icon: 'password',
    title: 'Сменить пароль',
  };
  changeEmailBtn = {
    icon: 'mail',
    title: 'Сменить email',
  };
  contBtnEdit = {
    icon: EDIT_ICON,
    title: EDIT,
    actions: (contact: ContactDialogModel) => {
      this.editContact(contact);
    },
  };
  contBtnDelete = {
    icon: DELETE_ICON,
    title: DELETE,
    actions: (contact: ContactDialogModel) => {
      this.deleteContact(contact);
    },
  };
  contactSublock = {
    title: CONTACTS,
    saveButton: { icon: SAVE_ICON, title: SAVE_CONTACTS },
    addButton: { icon: ADD_ICON, title: ADD_CONTACT },
    field: CONTACT,
    menu: {
      icon: MORE_VERT_ICON,
      btns: [this.contBtnEdit, this.contBtnDelete],
    },
  };
  skillSublock = {
    title: SKILLS,
    saveButton: { icon: SAVE_ICON, title: SAVE_SKILLS },
    addButton: { icon: ADD_ICON, title: ADD_SKILL },
    deleteButton: { icon: CANCEL_ICON },
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

  contacts: ContactModel[] = [];
  userContacts: ContactDialogModel[] = [];
  levels: TagLevelModel[] = [];
  portfolioTypes: PortfolioType[] = [];
  userSkills: TagUserModel[] = [];
  showRegion = false;

  regionId?: number;
  cityId?: number;

  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);
  profile: UserAbstractModel = profileInitialState;

  form = new FormGroup({
    username: new FormControl(this.profile.username),
    firstname: new FormControl(this.profile.firstname, [Validators.required]),
    lastname: new FormControl(this.profile.lastname, [Validators.required]),
    birthdate: new FormControl(),
    city: new FormControl(this.profile.user?.city?.name),
    region: new FormControl(null),
  });

  inputs = [
    new UsernameFormFieldInput(this.form),
    new LastnameFormFieldInput(this.form),
    new FirstnameFormFieldInput(this.form),
  ];

  birthdateInput = new BirthdayFormFieldInput(this.form);
  regionInput = new RegionFormFieldInput(this.form);
  cityInput = new CityFormFieldInput(this.form);

  constructor(
    private store: Store<{ profile: UserAbstractModel }>,
    private otherService: OtherService,
    private tagService: TagService,
    private portfolioService: PortfolioService,
    public dialog: MatDialog,
    private router: Router,
    private injector: Injector,
    private _snackBar: MatSnackBar
  ) {}
  subProfile: any;
  ngOnDestroy(): void {
    this.subProfile.unsubscribe();
  }
  ngOnInit() {
    this.subProfile = this.profile$?.subscribe((profile: UserAbstractModel) => {
      this.profile = profile;
      this.setField(UNAME, this.profile.username);
      this.setField(FNAME, this.profile.firstname);
      this.setField(LNAME, this.profile.lastname);
      this.setBirthdate();
      this.setField(CITY, this.profile.user?.city?.name);
      this.setCityId();
      this.compileUserContacts();
      this.compileUserSkills();
    });

    this.loadRegion();
    this.loadCity();
    this.otherService.GetContacts().subscribe((contacts) => {
      this.contacts = contacts;
    });
    this.tagService.GetLevels().subscribe((levels) => {
      this.levels = levels;
    });
    this.portfolioService.GetAllTypes().subscribe((types) => {
      this.portfolioTypes = types;
    });
  }

  setField(path: string, value: any) {
    this.form.get(path)?.setValue(value);
  }

  setCityId() {
    let id = this.profile.user?.city?.id;
    if (id && id > 0) this.cityId = id;
  }

  setBirthdate() {
    if (this.profile.user?.birthdate) {
      let d = new Date(this.profile.user?.birthdate);
      this.setField(BIRTHDATE, d);
    }
  }

  compileUserContacts() {
    this.userContacts = [];
    this.profile.user?.contacts?.forEach((contact) => {
      let v = `${contact.contact?.title}: ${contact.value}`;
      let formControl = new FormControl(v);
      let c = new ContactDialogModel(contact, formControl);
      this.userContacts.push(c);
    });
  }

  compileUserSkills() {
    if (this.profile.user?.tags)
      this.userSkills = JSON.parse(JSON.stringify(this.profile.user.tags));
  }

  loadCity(
    substr?: string,
    regionId?: number,
    limit?: number,
    offset?: number
  ) {
    this.cityInput.loadingData();
    this.otherService.GetCities(substr, regionId, limit, offset).subscribe(
      (result) => {
        this.cityInput.loadData(result.items);
        this.showRegion = false;
      },
      (err) => {
        if (err.status === 404) this.showRegion = true;
      }
    );
  }

  onKeyupCity() {
    let v: string = this.cityInput.formControl.value;
    this.loadCity(v, this.regionId);
  }

  selectCity(city: CityModel) {
    this.cityId = city.id;
  }

  loadRegion(substr?: string, limit?: number, offset?: number) {
    this.regionInput.loadingData();
    this.otherService.GetRegions(substr, limit, offset).subscribe(
      (result: any) => {
        this.regionInput.loadData(result.items);
      },
      (err: any) => {}
    );
  }

  selectRegion(region: RegionModel) {
    this.regionId = region.id;
  }

  onKeyupRegion() {
    let v: string = this.regionInput.formControl.value;
    this.loadRegion(v);
  }

  saveProfile() {
    const { username, firstname, lastname, birthdate, city, region } =
      this.form.value;

    let c = null;
    if (this.cityId) {
      c = new CityUpdateModel(this.cityId);
    } else if (city && this.regionId) {
      c = new CityUpdateModel(undefined, city, this.regionId);
    } else if (city && region) {
      c = new CityUpdateModel(undefined, city, undefined, region);
    }

    let b = null;
    if (birthdate) {
      b = formatDate(birthdate, FORMAT_DATE, LOCALE_RU);
    }

    let user = new UpdateUserModel(username, firstname, lastname, b, c);
    this.store.dispatch(updateProfile({ parametr: user }));
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.store.dispatch(loadMyProfile({}));
    });
  }

  addContact() {
    let link = new ContactUserModel('');
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
        this.userContacts.push(result);
      }
    });
  }
  changeEmail() {
    this.dialog.open(DialogResetEmailComponent, {
      ...CONFIG_DIALOG,
      data: { email: this.profile.email },
    });
  }
  changePassword() {
    this.dialog.open(DialogResetPasswordComponent, {
      ...CONFIG_DIALOG,
      data: {},
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
    commonDelete(this.userContacts, contact);
  }
  saveContacts() {
    let addContacts: AddContact[] = [];
    let deleteContacts: number[] = [];

    this.profile.user?.contacts?.forEach((contact) => {
      let arr = this.userContacts.filter((c) => c.link?.id === contact.id);
      if (arr.length == 0 && contact.id) deleteContacts.push(contact.id);
    });

    this.userContacts.forEach((contact) => {
      if (!contact.link.id && contact.link.contact) {
        let c = new AddContact(contact.link.contact.id, contact.link.value);
        addContacts.push(c);
      }
    });

    if (this.checkChangeContSkills(addContacts, deleteContacts)) {
      let user = new UpdateUserModel(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        addContacts,
        deleteContacts
      );

      this.store.dispatch(updateProfile({ parametr: user }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.store.dispatch(loadMyProfile({}));
      });
    } else showMessage(this._snackBar, NO_CHANGE_CONTACTS);
  }
  addSkill() {
    let tag = new TagUserModel(null, null);
    const dialogRef = this.dialog.open(DialogSkillAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        levels: this.levels,
        tag: tag,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userSkills.push(result);
      }
    });
  }
  editSkill(tag: TagUserModel) {
    this.dialog.open(DialogSkillAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        levels: this.levels,
        tag: tag,
      },
    });
  }
  deleteSkill(tag: TagUserModel) {
    if (tag.tag && tag.tag.id > 0) {
      commonDelete(this.userSkills, tag);
      this.store.dispatch(deleteTag({ parametr: tag.tag.id }));
    }
  }
  checkChange(skill: TagUserModel, tags?: TagUserModel[]) {
    if (tags) {
      let res = tags.filter(
        (t) => t.level?.id == skill.level?.id && t.tag?.id == skill.tag?.id
      );
      return !(res.length > 0);
    }
    return true;
  }
  checkChangeContSkills(arr1: any[], arr2: any[]) {
    return arr1.length > 0 || arr2.length > 0;
  }
  saveSkills() {
    let tags: TagCreateIdModel[] = [];
    let tag_names: TagCreateNameModel[] = [];
    let ts = this.profile.user?.tags;

    this.userSkills.forEach((skill) => {
      if (this.checkChange(skill, ts)) {
        if (skill.tag?.id == -1 && skill.level?.id) {
          let tagName = new TagCreateNameModel(skill.tag.name, skill.level.id);
          tag_names.push(tagName);
        } else if (skill.tag?.id && skill.level?.id) {
          let tagId = new TagCreateIdModel(skill.tag?.id, skill.level.id);
          tags.push(tagId);
        }
      }
    });

    if (this.checkChangeContSkills(tags, tag_names)) {
      let data = new TagCreateModel(tags, tag_names);
      this.store.dispatch(addTag({ parametr: data }));
    } else showMessage(this._snackBar, NO_CHANGE_SKILLS);
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
          this.store.dispatch(loadMyProfile({}));
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
          undefined,
          p.getted_at,
          result.tags,
          result.tag_names,
          mat
        );
        let sub = anySuccess.subscribe((res) => {
          sub.unsubscribe();
          this.store.dispatch(loadMyProfile({}));
          showMessage(this._snackBar, 'Достижение добавлено');
        });
        this.store.dispatch(addPortfolio({ parametr: data }));
      }
    });
  }

  deletePortfolio(portfolio: PortfolioModel) {
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.store.dispatch(loadMyProfile({}));
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

  deleteProfile() {
    this.store.dispatch(deleteUser());
  }

  checkUser() {
    return this.profile.role_id != ADMIN_ROLE_ID;
  }

  urlAvatar(avatar?: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_NO_PHOTO);
  }

  getStatus(is_approved: boolean | undefined) {
    if (is_approved == null) return 'на рассмотрение';
    else if (is_approved) return 'одобрен';
    else return 'отклонен';
  }

  getColor(is_approved: boolean | undefined) {
    if (is_approved == null) return { color: 'blue' };
    return { color: is_approved ? 'green' : 'red' };
  }

  openGroup(group: GroupDBModel) {
    if (group) {
      let url = `/${SYSTEM_MODULE}/${GROUP_PAGE}/${selectId(group)}`;
      this.router.navigate([url]);
    }
  }

  delRequestVac(vacancy: Vacancy2UserModel) {
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.store.dispatch(loadMyProfile({}));
    });
    this.store.dispatch(
      deleteVacancyResponse({ parametr: vacancy.vacancy_id })
    );
  }
  appInvite(invite: GroupInviteWithGroupModel) {
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.store.dispatch(loadMyProfile({}));
    });
    let d = new ResponseInviteModel(invite.group_id, true);
    this.store.dispatch(putInvite({ parametr: d }));
  }
  rejInvite(invite: GroupInviteWithGroupModel) {
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.store.dispatch(loadMyProfile({}));
    });
    let d = new ResponseInviteModel(invite.group_id, false);
    this.store.dispatch(putInvite({ parametr: d }));
  }
  delInvite(invite: GroupInviteWithGroupModel) {
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.store.dispatch(loadMyProfile({}));
    });
    this.store.dispatch(deleteInvite({ parametr: invite.group_id }));
  }
}
