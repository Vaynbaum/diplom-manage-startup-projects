import { Component, OnInit, HostListener } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LINK_PAGE_PROFILE } from '../shared/consts';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class NotFoundPageComponent implements OnInit {
  constructor() {}
  title = '404 ошибка';
  desc = 'Похоже, мы не можем найти нужную страницу';
  btn = 'Перейти на главную';
  homeLink=LINK_PAGE_PROFILE

  styleEyes = '';
  pageX = window.innerWidth;
  pageY = window.innerHeight;
  mouseY = 0;
  mouseX = 0;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: any) {
    //verticalAxis
    this.mouseY = event.pageY;
    let yAxis = ((this.pageY  - this.mouseY) / this.pageY) * 200;

    //horizontalAxis
    this.mouseX = event.pageX / -this.pageX;
    let xAxis = -this.mouseX * 100 - 100;

    this.styleEyes = 'translate(' + xAxis + '%,-' + yAxis + '%)';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.pageX = window.innerWidth;
    this.pageY = window.innerHeight;
  }

  ngOnInit() {}
}
