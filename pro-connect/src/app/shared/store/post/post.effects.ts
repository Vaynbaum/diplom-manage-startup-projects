import { EventEmitter, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from '../../services/post.service';
import {
  createPost,
  createPostSuccess,
  deletePost,
  likePost,
  likePostSuccess,
  updatePost,
} from './post.actions';
import { catchError, exhaustMap, map, tap } from 'rxjs';
import { anySuccess, factoryHandleError } from '../common.effects';
import { commonFailed, commonSuccessShutup } from '../common.actions';
export let likedPost = new EventEmitter<boolean>();

@Injectable()
export class PostEffects {
  constructor(private actions$: Actions, private postService: PostService) {}

  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createPost),
      exhaustMap((action) =>
        this.postService.CreatePost(action.parametr).pipe(
          map((post) => createPostSuccess({ post })),
          catchError(
            factoryHandleError(createPost, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  createPostSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createPostSuccess),
        tap(({ post }) => {
          anySuccess.emit(post);
        })
      ),
    { dispatch: false }
  );
  updatePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePost),
      exhaustMap((action) =>
        this.postService.UpdatePost(action.parametr).pipe(
          map((post) => createPostSuccess({ post })),
          catchError(
            factoryHandleError(updatePost, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  deletePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePost),
      exhaustMap((action) =>
        this.postService.DeletePost(action.parametr).pipe(
          map((message) => commonSuccessShutup({ message })),
          catchError(
            factoryHandleError(deletePost, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  likePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(likePost),
      exhaustMap((action) =>
        this.postService.LikePost(action.parametr).pipe(
          map((res) => likePostSuccess({ res })),
          catchError(
            factoryHandleError(likePost, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  likePostSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(likePostSuccess),
        tap(({ res }) => {
          likedPost.emit(res);
        })
      ),
    { dispatch: false }
  );
}
