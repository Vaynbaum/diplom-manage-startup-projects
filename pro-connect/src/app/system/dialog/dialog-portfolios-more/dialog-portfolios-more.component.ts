import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogPortfoliosMoreData } from '../../../shared/interfaces/dialog-portfolios-more';
import { PortfolioModel } from '../../../shared/models/backend/portfolio.model';
import { CONFIG_DIALOG } from '../../../shared/consts';
import { DialogPortfolioMoreComponent } from '../dialog-portfolio-more/dialog-portfolio-more.component';

@Component({
  selector: 'app-dialog-portfolios-more',
  templateUrl: './dialog-portfolios-more.component.html',
  styleUrls: ['./dialog-portfolios-more.component.scss'],
})
export class DialogPortfoliosMoreComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogPortfoliosMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogPortfoliosMoreData
  ) {}

  ngOnInit() {}
  openPortfolio(portfolio: PortfolioModel) {
    let c = structuredClone(CONFIG_DIALOG);
    c.maxWidth = '700px';
    this.dialog.open(DialogPortfolioMoreComponent, {
      ...c,
      data: { portfolio: portfolio },
    });
  }
}
