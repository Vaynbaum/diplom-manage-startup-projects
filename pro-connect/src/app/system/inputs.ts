import { FormGroup } from '@angular/forms';
import { FormFieldInput } from '../shared/models/special/form-field-input';
import { LOCATION, NICK, TEXT, TEXTAREA, TITLE } from '../shared/consts';
import {
  BIRTHDATE,
  CITY,
  CONTACT,
  LEVEL,
  NAME,
  NOTE,
  REGION,
  SCHOOL,
  SKILL,
  STATUS,
  TYPE,
  UNAME,
} from './consts';
import {
  LOADING_CITY,
  LOADING_REGION,
  LOADING_SKILLS,
  LOADING_STATUSES,
  LOADING_TYPES,
  L_ENTER_ACTIVITY,
  L_ENTER_BIRTHDAY,
  L_ENTER_CCONTACT,
  L_ENTER_CITY,
  L_ENTER_CONTACT,
  L_ENTER_GROUP,
  L_ENTER_GROUP_ROLE,
  L_ENTER_LEVEL,
  L_ENTER_NAME,
  L_ENTER_NOTE,
  L_ENTER_REGION,
  L_ENTER_SKILL,
  L_ENTER_STATUS,
  L_ENTER_TYPE,
  L_ENTER_UNAME,
  P_ENTER_ACTIVITY,
  P_ENTER_BIRTHDAY,
  P_ENTER_CCONTACT,
  P_ENTER_CITY,
  P_ENTER_CONTACT,
  P_ENTER_GROUP,
  P_ENTER_GROUP_ROLE,
  P_ENTER_LEVEL,
  P_ENTER_NAME,
  P_ENTER_NOTE,
  P_ENTER_REGION,
  P_ENTER_ROLE,
  P_ENTER_SKILL,
  P_ENTER_STATUS,
  P_ENTER_TYPE,
  P_ENTER_UNAME,
} from './phrases';

export class UsernameFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_UNAME,
    placeholder = P_ENTER_UNAME
  ) {
    super(label, form.get?.(UNAME), placeholder, NICK, TEXT);
  }
}

export class NameFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_NAME,
    placeholder = P_ENTER_NAME
  ) {
    super(label, form.get?.(NAME), placeholder, TITLE, TEXT);
  }
}

export class ValueFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = 'Значение',
    placeholder = 'Введите значение',
    icon = 'feed'
  ) {
    super(label, form.get?.('value'), placeholder, icon, TEXT);
  }
}

export class NoteFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_NOTE,
    placeholder = P_ENTER_NOTE
  ) {
    super(label, form.get?.(NOTE), placeholder, undefined, TEXTAREA);
  }
}
export class DirectionFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = 'Загрузка направлений...',
    placeholder = 'Загрузка направлений...'
  ) {
    super(label, form.get?.('direction'), placeholder, 'chevron_right', TEXT);
  }

  public override loadData(items: any) {
    this.items = items;
    this.values = this.compile_values();
    this.label = 'Направление проекта';
    this.placeholder = 'Выберите направление';
  }

  public override loadingData() {
    this.label = 'Загрузка направлений...';
    this.placeholder = 'Загрузка направлений...';
  }
}
export class StatusActFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = LOADING_STATUSES,
    placeholder = LOADING_STATUSES
  ) {
    super(label, form.get?.(STATUS), placeholder, 'grade', TEXT);
  }

  public override loadData(items: any) {
    this.items = items;
    this.values = this.compile_values();
    this.label = L_ENTER_STATUS;
    this.placeholder = P_ENTER_STATUS;
  }

  public override loadingData() {
    this.label = LOADING_STATUSES;
    this.placeholder = LOADING_STATUSES;
  }
}
export class TypePortfolioFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = LOADING_TYPES,
    placeholder = LOADING_TYPES
  ) {
    super(label, form.get?.(TYPE), placeholder, 'note_stack', TEXT);
  }

  public override loadData(items: any) {
    this.items = items;
    this.values = this.compile_values();
    this.label = 'Тип достижения';
    this.placeholder = P_ENTER_TYPE;
  }

  public override loadingData() {
    this.label = LOADING_TYPES;
    this.placeholder = LOADING_TYPES;
  }
}
export class TypeNewsFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = 'Загрузка видов...',
    placeholder = 'Загрузка видов...'
  ) {
    super(label, form.get?.(TYPE), placeholder, 'newspaper', TEXT);
  }

  public override loadData(items: any) {
    this.items = items;
    this.values = this.compile_values();
    this.label = 'Вид новости';
    this.placeholder = 'Выберите вид новости';
  }

  public override loadingData() {
    this.label = 'Загрузка видов...';
    this.placeholder = 'Загрузка видов...';
  }
}
export class TypeGroupFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = LOADING_TYPES,
    placeholder = LOADING_TYPES,
    icon = 'groups'
  ) {
    super(label, form.get?.(TYPE), placeholder, icon, TEXT);
  }

  public override loadData(items: any) {
    this.items = items;
    this.values = this.compile_values();
    this.label = L_ENTER_TYPE;
    this.placeholder = P_ENTER_TYPE;
  }

  public override loadingData() {
    this.label = LOADING_TYPES;
    this.placeholder = LOADING_TYPES;
  }
}

export class BirthdayFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_BIRTHDAY,
    placeholder = P_ENTER_BIRTHDAY
  ) {
    super(
      label,
      form.get?.(BIRTHDATE),
      placeholder,
      undefined,
      TEXT,
      false,
      false,
      true
    );
  }
}

export class CityFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = LOADING_CITY,
    placeholder = LOADING_CITY
  ) {
    super(label, form.get?.(CITY), placeholder, LOCATION, TEXT);
  }

  public override loadData(
    items: any,
    placeholder: string = P_ENTER_CITY,
    label: string = L_ENTER_CITY
  ) {
    this.items = items;
    this.values = this.compile_values();
    this.label = label;
    this.placeholder = placeholder;
  }

  public override loadingData() {
    (this.label = LOADING_CITY), (this.placeholder = LOADING_CITY);
  }
}

export class RegionFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = LOADING_REGION,
    placeholder = LOADING_REGION
  ) {
    super(label, form.get?.(REGION), placeholder, 'south_america', TEXT);
  }

  public override loadData(items: any) {
    this.items = items;
    this.values = this.compile_values();
    this.label = L_ENTER_REGION;
    this.placeholder = P_ENTER_REGION;
  }

  public override loadingData() {
    this.label = LOADING_REGION;
    this.placeholder = LOADING_REGION;
  }
}

export class ContactFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_CONTACT,
    placeholder = P_ENTER_CONTACT
  ) {
    super(label, form.get?.(CONTACT), placeholder, 'contacts', TEXT);
  }
}

export class ContacTypeFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_CCONTACT,
    placeholder = P_ENTER_CCONTACT
  ) {
    super(label, form.get?.(TYPE), placeholder);
  }

  public override loadData(items: any) {
    this.items = items;
  }
}

export class LevelFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_LEVEL,
    placeholder = P_ENTER_LEVEL
  ) {
    super(label, form.get?.(LEVEL), placeholder);
  }

  public override loadData(items: any) {
    this.items = items;
  }
}
export class GroupFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_GROUP,
    placeholder = P_ENTER_GROUP
  ) {
    super(label, form.get?.('group'), placeholder);
  }

  public override loadData(items: any) {
    this.items = items;
  }
}
export class ActivityFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_ACTIVITY,
    placeholder = P_ENTER_ACTIVITY
  ) {
    super(label, form.get?.('activity'), placeholder);
  }

  public override loadData(items: any) {
    this.items = items;
  }
}

export class RoleFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_GROUP_ROLE,
    placeholder = P_ENTER_ROLE
  ) {
    super(label, form.get?.('role'), placeholder);
  }

  public override loadData(items: any) {
    this.items = items;
  }
}

export class TagFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = LOADING_SKILLS,
    placeholder = LOADING_SKILLS
  ) {
    super(label, form.get?.(SKILL), placeholder, SCHOOL, TEXT);
  }

  public override loadData(
    items: any,
    placeholder: string = P_ENTER_SKILL,
    label: string = L_ENTER_SKILL
  ) {
    this.items = items;
    this.values = this.compile_values();
    this.label = label;
    this.placeholder = placeholder;
  }

  public override loadingData() {
    this.label = LOADING_SKILLS;
    this.placeholder = LOADING_SKILLS;
  }
}

export class GroupRoleFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_GROUP_ROLE,
    placeholder = P_ENTER_GROUP_ROLE
  ) {
    super(label, form.get?.('role'), placeholder, TITLE, TEXT);
  }
}
