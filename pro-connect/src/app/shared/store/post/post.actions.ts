import { createAction, props } from '@ngrx/store';
import {
  CreatePostModel,
  PostModel,
  UpdatePostModel,
} from '../../models/backend/post.model';

export const createPost = createAction(
  '[Profile Component] Create Post',
  props<{ parametr: CreatePostModel }>()
);
export const createPostSuccess = createAction(
  '[Profile Component] Create Post Success',
  props<{ post: PostModel }>()
);
export const updatePost = createAction(
  '[Profile Component] Update Post',
  props<{ parametr: UpdatePostModel }>()
);
export const deletePost = createAction(
  '[Profile Component] Delete Post',
  props<{ parametr: number }>()
);
export const likePost = createAction(
  '[Profile Component] Like Post',
  props<{ parametr: number }>()
);
export const likePostSuccess = createAction(
  '[Profile Component] Like Post Success',
  props<{ res: boolean }>()
);
