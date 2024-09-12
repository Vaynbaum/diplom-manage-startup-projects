import { ContactModel } from '../models/backend/contact.model';
import { ContactDialogModel } from '../models/special/contact';

export interface DialogContactAddData {
  contact: ContactDialogModel;
  types: ContactModel[];
}
