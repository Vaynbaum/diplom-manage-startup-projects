import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAbstractModel } from '../models/backend/user_abstract.model';
import { Observable } from 'rxjs';
import { LINK_PAGE_SIGNIN, NAME_REDUCER_PROFILE } from '../consts';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { showMessage } from '../functions';
import { ResponseItemsModel } from '../models/backend/response-items.model';
import { NoteModel, ReadedNotesModel } from '../models/backend/note.model';
const TIMEOUT = 3000;
const URL = `${environment.BACKEND_NOTE_URL}`;
const URL_WS = `${environment.BACKEND_WS_NOTE_URL}`;
export type GetNotesParam = {
  limit?: number;
  offset?: number;
};
@Injectable({
  providedIn: 'root',
})
export class NoteService {
  isConnect = false;
  ws: WebSocketSubject<unknown> | undefined;
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);
  @Output() noteGetted = new EventEmitter<NoteModel | ReadedNotesModel>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private store: Store<{ profile: UserAbstractModel }>
  ) {}

  SendMessage(message: any) {
    this.ws?.next(message);
  }

  Close() {
    this.ws?.complete();
  }

  handleCode(data: any) {
    if (data.code == 401) {
      this.authService.RefreshToken().subscribe(
        (tokens) => {
          this.authService.SaveTokens(tokens);
          this.Connect();
        },
        () => {
          this.authService.DeleteTokens();
          this.router.navigate([LINK_PAGE_SIGNIN], {
            queryParams: { authAgain: true },
          });
        }
      );
    } else if (data.code == 200) {
      // console.log(data.msg);
    } else {
      showMessage(this._snackBar, data.msg);
    }
  }

  playAudio() {
    // console.log('Play')
    let audio = new Audio();
    audio.src = '../../../assets/audio/note.mp3';
    audio.load();
    audio.play();
  }

  Connect() {
    this.profile$?.subscribe((profile: UserAbstractModel) => {
      if (profile && profile.id != -1 && !this.isConnect) {
        this.isConnect = true;
        let token = this.authService.GetAccessToken();
        this.ws = webSocket(`${URL_WS}/notifications?token=${token.token}`);

        this.ws?.asObservable().subscribe(
          (dataFromServer: any) => {
            if (dataFromServer.code) {
              this.handleCode(dataFromServer);
            } else {
              if (dataFromServer.readed) {
                this.noteGetted.emit(
                  new ReadedNotesModel(
                    dataFromServer.ids,
                    dataFromServer.readed
                  )
                );
              } else {
                this.noteGetted.emit(dataFromServer);
              }
            }
          },
          (err) => {
            setTimeout(() => {
              this.Connect();
            }, TIMEOUT);
          },
          () => {
            this.isConnect = false;
          }
        );
      }
    });
  }

  GetAllNotifications(params: GetNotesParam) {
    return this.httpClient.get<ResponseItemsModel<NoteModel>>(`${URL}/all`, {
      params: params,
    });
  }
}
