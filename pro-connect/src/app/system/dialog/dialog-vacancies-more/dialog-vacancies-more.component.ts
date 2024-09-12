import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogVacanciesMoreData } from '../../../shared/interfaces/dialog-items-more';
import { VacancyModel } from '../../../shared/models/backend/vacancy.model';
import { DialogVacancyMoreComponent } from '../dialog-vacancy-more/dialog-vacancy-more.component';
import { CONFIG_DIALOG } from '../../../shared/consts';

@Component({
  selector: 'app-dialog-vacancies-more',
  templateUrl: './dialog-vacancies-more.component.html',
  styleUrls: ['./dialog-vacancies-more.component.scss'],
})
export class DialogVacanciesMoreComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogVacanciesMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogVacanciesMoreData
  ) {}

  ngOnInit() {}

  openVacancy(vacancy: VacancyModel) {
    this.dialog.open(DialogVacancyMoreComponent, {
      ...CONFIG_DIALOG,
      data: {
        vacancy: vacancy,
      },
    });
  }
}
