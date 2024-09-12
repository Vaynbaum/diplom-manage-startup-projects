import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogTagMoreData } from '../../../shared/interfaces/dialog-tag-more';
import { LEVEL, SKILL } from '../../phrases';
import { GRADE, SCHOOL } from '../../consts';

@Component({
  selector: 'app-dialog-tag-more',
  templateUrl: './dialog-tag-more.component.html',
  styleUrls: ['./dialog-tag-more.component.scss'],
})
export class DialogTagMoreComponent implements OnInit {
  skill = { title: SKILL, icon: SCHOOL };
  level = { title: LEVEL, icon: GRADE };

  constructor(
    public dialogRef: MatDialogRef<DialogTagMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogTagMoreData
  ) {}

  ngOnInit() {}
}
