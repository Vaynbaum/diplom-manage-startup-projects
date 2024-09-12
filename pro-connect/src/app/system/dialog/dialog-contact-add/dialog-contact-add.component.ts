import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogContactAddData } from '../../../shared/interfaces/dialog-contact-add';
import { CONTACT } from '../../phrases';
import { SAVE_BTN } from '../../../shared/phrases';
import { ContacTypeFormFieldInput, ContactFormFieldInput } from '../../inputs';
import { ContactModel, ContactUserModel } from '../../../shared/models/backend/contact.model';

@Component({
  selector: 'app-dialog-contact-add',
  templateUrl: './dialog-contact-add.component.html',
  styleUrls: ['./dialog-contact-add.component.scss'],
})
export class DialogContactAddComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogContactAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogContactAddData
  ) {}

  title = CONTACT;
  saveBtn = SAVE_BTN;
  selectTypeContact?: ContactModel;

  form = new FormGroup({
    contact: new FormControl(this.data.contact.link.value, [
      Validators.required,
    ]),
    type: new FormControl(this.data.contact.link.contact?.title, [
      Validators.required,
    ]),
  });

  contactInput = new ContactFormFieldInput(this.form);
  typeInput = new ContacTypeFormFieldInput(this.form);

  ngOnInit() {
    this.selectTypeContact = this.data.contact.link.contact;
    this.typeInput.loadData(this.data.types);
  }

  selectContact(contact: ContactModel) {
    this.selectTypeContact = contact;
  }

  save() {
    const { contact, type } = this.form.value;
    if (contact && type && this.selectTypeContact) {
      let newLink = new ContactUserModel(contact);
      newLink.contact = this.selectTypeContact;
      this.data.contact.link = newLink;

      let v = `${this.data.contact.link.contact?.title}: ${this.data.contact.link.value}`;
      this.data.contact.formControl.setValue(v);
      this.dialogRef.close(this.data.contact);
    }
  }
}
