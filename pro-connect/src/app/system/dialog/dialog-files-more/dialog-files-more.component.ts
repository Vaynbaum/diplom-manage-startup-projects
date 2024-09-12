import { DialogFilesMoreData } from './../../../shared/interfaces/dialog-files-more';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { compileURLImg } from '../../../shared/functions';
import { DEFAULT_NO_PHOTO } from '../../consts';

@Component({
  selector: 'app-dialog-files-more',
  templateUrl: './dialog-files-more.component.html',
  styleUrls: ['./dialog-files-more.component.scss'],
})
export class DialogFilesMoreComponent implements OnInit {
  title = 'Прикрепленные файлы';
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogFilesMoreData) {}

  ngOnInit() {}
  compileURLImg(url: string) {
    let c_url = compileURLImg(url, DEFAULT_NO_PHOTO);
    return c_url ? c_url : DEFAULT_NO_PHOTO;
  }

  redirectLink(url: string) {
    let c_url = compileURLImg(url);
    if (c_url) window.open(c_url, '_blank');
  }
}
