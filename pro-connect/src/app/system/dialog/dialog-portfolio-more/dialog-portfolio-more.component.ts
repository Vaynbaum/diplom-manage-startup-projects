import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogPortfolioMoreData } from '../../../shared/interfaces/dialog-portfolio-more';
import { compileURLImg } from '../../../shared/functions';

@Component({
  selector: 'app-dialog-portfolio-more',
  templateUrl: './dialog-portfolio-more.component.html',
  styleUrls: ['./dialog-portfolio-more.component.scss'],
})
export class DialogPortfolioMoreComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogPortfolioMoreData) {}

  ngOnInit() {
    // console.log(this.data.portfolio);
  }

  compileUrl(url: string | undefined) {
    if (url) {
      let res = compileURLImg(url);
      return res ? res : '';
    }
    return '';
  }

  redirectLink(url: string | undefined) {
    if (url) {
      let c_url = compileURLImg(url);
      if (c_url) window.open(c_url, '_blank');
    }
  }
}
