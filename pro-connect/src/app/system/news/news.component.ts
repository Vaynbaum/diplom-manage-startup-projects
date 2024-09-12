import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PostModel } from '../../shared/models/backend/post.model';
import { PostService } from '../../shared/services/post.service';
import { UserAbstractModel } from '../../shared/models/backend/user_abstract.model';
import { Observable } from 'rxjs';
import { NAME_REDUCER_PROFILE } from '../../shared/consts';
import { profileInitialState } from '../../shared/store/profile/profile.reducer';
import { Store } from '@ngrx/store';
import { TagFormFieldInput, TypeNewsFormFieldInput } from '../inputs';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonTypeModel } from '../../shared/models/backend/type.model';
import { commonDelete } from '../../shared/functions';
import { TagModel } from '../../shared/models/backend/tag.model';
import { TagService } from '../../shared/services/tag.service';

@Component({
  selector: 'app-messages',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit, OnDestroy {
  searchField = {
    label: 'Поиск новостей',
    placeholder: 'Какие новости найти?',
    closeBtn: 'close',
    searchBtn: 'search',
  };
  selectedType?: CommonTypeModel[];
  searchValue = '';
  selectedTags: TagModel[] = [];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement> | undefined;

  postOffset?: number = 0;
  posts: PostModel[] = [];
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);
  profile: UserAbstractModel = profileInitialState;
  constructor(
    private store: Store<{ profile: UserAbstractModel }>,
    private tagService: TagService,
    private postService: PostService
  ) {}
  ngOnDestroy(): void {
    this.ps.unsubscribe();
  }
  form = new FormGroup({
    type: new FormControl(null),
    skill: new FormControl(null),
  });
  typeInput = new TypeNewsFormFieldInput(this.form);
  skillInput = new TagFormFieldInput(this.form);
  ps: any;
  ngOnInit() {
    this.loadType();
    this.loadTags();

    this.ps = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.profile = res;
    });

    this.posts = [];
    this.getPosts();
  }
  getPosts(substr?: string, type_id?: number[], tag_ids?: number[]) {
    this.postService
      .GetAllPosts(
        this.postOffset,
        undefined,
        undefined,
        undefined,
        type_id,
        tag_ids,
        substr
      )
      .subscribe(
        (res) => {
          this.postOffset = res.offset;
          this.posts = res.items;
        },
        (err) => {
          if (err.status == 404) {
            this.posts = [];
            this.postOffset = 0;
          }
        }
      );
  }
  onKeyup() {
    this.getPostsAllFilter();
  }
  clearSearchValue() {
    this.searchValue = '';
    this.getPostsAllFilter();
  }

  selectType() {
    this.selectedType = this.typeInput.formControl.value;
    this.getPostsAllFilter();
  }
  otherStatus() {
    let c = this.typeInput.formControl.value.length - 1;
    return `(+${c} ${c == 1 ? 'тип' : 'типа'})`;
  }
  loadType() {
    this.typeInput.loadingData();
    this.postService.GetAllTypes().subscribe(
      (result) => {
        this.typeInput.loadData(result);
      },
      (err) => {}
    );
  }

  deleteTag(tag: TagModel) {
    commonDelete(this.selectedTags, tag);

    let ids = this.selectedTags.map((item) => item.id);
    let v: string = this.skillInput.formControl.value;
    this.loadTags(v, ids);
    this.getPostsAllFilter();
  }
  loadTags(substr?: string, ids?: number[]) {
    this.skillInput.loadingData();
    this.tagService.GetTags(substr, ids, false, true).subscribe(
      (tags) => {
        this.skillInput.loadData(tags, 'Выберите теги', 'Теги');
      },
      (err) => {
        if (err.status == 404) this.skillInput.loadData([], err.error.detail);
      }
    );
  }
  selectTag(tag: TagModel) {
    if (!this.selectedTags.find((t) => t.id == tag.id)) {
      this.selectedTags.push(tag);
      this.skillInput.formControl.setValue(null);
      if (this.fruitInput) this.fruitInput.nativeElement.value = '';

      let ids = this.selectedTags.map((item) => item.id);
      this.loadTags('', ids);
      this.getPostsAllFilter();
    }
  }
  onKeyupTag() {
    let v: string = this.skillInput.formControl.value;
    let ids = this.selectedTags.map((item) => item.id);

    this.loadTags(v, ids);
  }

  getPostsAllFilter() {
    let ids = this.selectedTags.map((item) => item.id);
    let t_ids = this.selectedType?.map((item) => item.id);
    this.getPosts(this.searchValue, t_ids, ids);
  }

  resetFilters() {
    this.selectedType = undefined;
    this.typeInput.formControl.setValue(null);

    this.skillInput.formControl.setValue(null);
    if (this.fruitInput) this.fruitInput.nativeElement.value = '';

    this.selectedTags = [];
    this.loadTags();

    this.getPostsAllFilter();
  }

  displayValue() {
    if (
      this.typeInput.formControl.value &&
      this.typeInput.formControl.value.length > 0
    )
      return this.typeInput.formControl.value?.[0].name;
    return '';
  }
}
