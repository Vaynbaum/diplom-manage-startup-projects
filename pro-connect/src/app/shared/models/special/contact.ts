import { FormControl } from '@angular/forms';
import { ContactGroupModel, ContactUserModel } from '../backend/contact.model';

export class ContactDialogModel {
  constructor(
    public link: ContactUserModel | ContactGroupModel,
    public formControl: FormControl
  ) {}
}
