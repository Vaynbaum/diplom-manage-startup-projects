import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseItemsModel } from '../models/backend/response-items.model';
import {
  ActivityMessageModel,
  CreateMessageModel,
} from '../models/backend/act_message.model';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { UserAbstractModel } from '../models/backend/user_abstract.model';
import { Store } from '@ngrx/store';
import { LINK_PAGE_SIGNIN, NAME_REDUCER_PROFILE } from '../consts';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showMessage } from '../functions';

const TIMEOUT = 3000;
const URL = `${environment.BACKEND_MSG_URL}`;
const URL_WS = `${environment.BACKEND_WS_MSG_URL}`;

export type GetMsgsParam = {
  activity_id: number;
  limit?: number;
  offset?: number;
};
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private store: Store<{ profile: UserAbstractModel }>
  ) {}
  isConnect = false;
  @Output() messageGetted = new EventEmitter<any>();
  ws: WebSocketSubject<unknown> | undefined;
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);

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

  Close() {
    this.ws?.complete();
  }

  SendMessage(message: CreateMessageModel) {
    this.ws?.next(message);
  }

  Connect() {
    this.profile$?.subscribe((profile: UserAbstractModel) => {
      if (profile && profile.id != -1 && !this.isConnect) {
        this.isConnect = true;
        let token = this.authService.GetAccessToken();
        this.ws = webSocket(`${URL_WS}/messages?token=${token.token}`);

        this.ws?.asObservable().subscribe(
          (dataFromServer: any) => {
            if (dataFromServer.code) this.handleCode(dataFromServer);
            else this.messageGetted.emit(dataFromServer);
          },
          (err) => setTimeout(() => this.Connect(), TIMEOUT),
          () => (this.isConnect = false)
        );
      }
    });
  }

  GetAllMessages(params: GetMsgsParam) {
    return this.httpClient.get<ResponseItemsModel<ActivityMessageModel>>(
      `${URL}/all`,
      { params: params }
    );
  }
}
