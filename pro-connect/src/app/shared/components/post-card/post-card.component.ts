import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PostLike, PostModel } from '../../models/backend/post.model';
import { commonDelete, compileURLImg, selectId } from '../../functions';
import { DEFAULT_AVA, DEFAULT_NO_PHOTO } from '../../../system/consts';
import { UserAbstractModel } from '../../models/backend/user_abstract.model';
import {
  ACTIVITY_PAGE,
  ADMIN_ROLE_ID,
  CONFIG_DIALOG,
  GROUP_PAGE,
  PROFILE_PAGE,
  SYSTEM_MODULE,
} from '../../consts';
import { DialogPostAddComponent } from '../../../system/dialog/dialog-post-add/dialog-post-add.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { deletePost, likePost } from '../../store/post/post.actions';
import { anySuccess } from '../../store/common.effects';
import { likedPost } from '../../store/post/post.effects';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit, AfterViewInit {
  @Input() post?: PostModel;
  @Input() isEdit: boolean = true;
  @Input() profile?: UserAbstractModel;
  minHeight = Number.MAX_VALUE;
  @ViewChild('galleria', { static: false }) galleria?: ElementRef;
  @Output() PostDeleted = new EventEmitter<any>();

  images?: any[] = [];
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
  constructor(
    public dialog: MatDialog,
    private store: Store,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    if (this.galleria) this.calcMinHeight();
  }

  calcMinHeight() {
    this.minHeight = Number.MAX_VALUE;
    this.images?.forEach((i) => {
      let g = this.galleria;
      //@ts-ignore
      let p = i.img.height * g?.element?.nativeElement.clientWidth;
      let new_height = p / i.img.width;
      if (new_height < this.minHeight) this.minHeight = new_height;
    });
  }

  compileMaxHeight(container: boolean = false) {
    return { 'max-height': `${this.minHeight}px` };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calcMinHeight();
  }
  editPost() {
    let c = structuredClone(CONFIG_DIALOG);
    c.maxWidth = '1000px';
    let ms: any[] = [];
    this.post?.materials.files.forEach((image) =>
      ms.push({ ...image, type: 'file' })
    );
    this.post?.materials.images.forEach((image) =>
      ms.push({ ...image, type: 'image' })
    );
    const dialogRef = this.dialog.open(DialogPostAddComponent, {
      ...c,
      data: { post: this.post, files: ms },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result = structuredClone(result);
        this.post = result;
        this.compileImages();
      }
    });
  }

  likePost() {
    if (this.post) {
      this.store.dispatch(likePost({ parametr: this.post.id }));
      let sub = likedPost.subscribe((res) => {
        if (res) {
          if (this.post && this.profile) {
            this.post.likes.push(new PostLike(this.profile.id, this.post.id));
            this.post.cnt_like += 1;
          }
        } else {
          if (this.post && this.profile) {
            let flike = this.post.likes.find(
              (like) =>
                like.user_id == this.profile?.id &&
                like.post_id == this.post?.id
            );
            if (flike) {
              commonDelete(this.post.likes, flike);
              this.post.cnt_like -= 1;
            }
          }
        }
        sub.unsubscribe();
      });
    }
  }
  deletePost() {
    if (this.post) {
      this.store.dispatch(deletePost({ parametr: this.post?.id }));
    }
    let sub = anySuccess.subscribe((res) => {
      this.PostDeleted.emit();
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this.compileImages();
  }

  compileImages() {
    this.images = [];
    this.post?.materials.images.forEach((image) => {
      let u = compileURLImg(image.name);
      let blur_url = compileURLImg(image.details.blur_image.name);
      if (u) {
        let img = new Image();
        img.onload = () => {
          this.calcMinHeight();
        };
        img.src = u;
        this.images?.push({
          img: img,
          itemImageSrc: u,
          itemImageSrcBlur: blur_url,
        });
      }
    });
  }

  compileMinHeight() {
    return { height: `${this.minHeight}px` };
  }

  displayName() {
    if (this.post?.activity) return this.post.activity.name;
    if (this.post?.group) return this.post.group.name;
    if (this.post?.user)
      return `${this.post.user.firstname} ${this.post.user.lastname}`;
    else return '';
  }

  compileImg() {
    let defaul = this.post?.user ? DEFAULT_AVA : DEFAULT_NO_PHOTO;
    let avatar = null;
    if (this.post?.activity) avatar = this.post?.activity.img;
    if (this.post?.group) avatar = this.post?.group.avatar;
    if (this.post?.user) avatar = this.post?.user.avatar;

    let url = compileURLImg(avatar ? avatar.url : null, defaul);
    // return { 'background-image': `url(${url})` };
    return url
  }

  checkMyLike() {
    if (this.post && this.profile) {
      let like = this.post.likes.find(
        (like) => like.user_id == this.profile?.id
      );
      return like ? true : false;
    } else return false;
  }

  redirectLink(url: string) {
    let c_url = compileURLImg(url);
    if (c_url) window.open(c_url, '_blank');
  }

  setToCenter() {
    if (!(this.post?.cnt_like && this.post?.cnt_like > 0)) {
      return { position: 'absolute', left: '17px' };
    }
    return {};
  }

  goTo() {
    let url = '';
    if (this.post?.activity) {
      url = `/${SYSTEM_MODULE}/${ACTIVITY_PAGE}/${this.post?.activity.id}`;
    }
    if (this.post?.group) {
      url = `/${SYSTEM_MODULE}/${GROUP_PAGE}/${selectId(this.post?.group)}`;
    }
    if (this.post?.user) {
      let id = selectId(this.post?.user);
      url = `/${SYSTEM_MODULE}/${PROFILE_PAGE}/${id}`;
    }
    this.router.navigate([url]);
  }
  checkUser() {
    return this.profile?.role_id != ADMIN_ROLE_ID;
  }
}
