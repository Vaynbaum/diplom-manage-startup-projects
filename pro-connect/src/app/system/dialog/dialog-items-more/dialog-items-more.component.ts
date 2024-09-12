import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogItemsMoreData } from '../../../shared/interfaces/dialog-items-more';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-items-more',
  templateUrl: './dialog-items-more.component.html',
  styleUrls: ['./dialog-items-more.component.scss'],
})
export class DialogItemsMoreComponent implements OnInit {
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<DialogItemsMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogItemsMoreData
  ) {}

  ngOnInit() {}

  goTo(url: string) {
    this.router.navigate([url]);
    this.dialogRef.close();
  }
}
