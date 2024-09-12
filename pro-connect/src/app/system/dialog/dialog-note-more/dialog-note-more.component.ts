import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogNotesMoreData } from '../../../shared/interfaces/dialog-notes-more';
import { NoteModel } from '../../../shared/models/backend/note.model';
import { Store } from '@ngrx/store';
import { getNotes } from '../../../shared/store/message/message.actions';
import { notesGetted } from '../../../shared/store/message/message.effects';

@Component({
  selector: 'app-dialog-note-more',
  templateUrl: './dialog-note-more.component.html',
  styleUrls: ['./dialog-note-more.component.scss'],
})
export class DialogNoteMoreComponent implements OnInit, OnDestroy {
  title = 'Уведомления';
  block: any = document.getElementById('block');
  notes: NoteModel[] = [];
  constructor(
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: DialogNotesMoreData
  ) {}
  ngOnDestroy(): void {
    this.nsg.unsubscribe();
  }
  nsg: any;
  ngOnInit() {
    this.readLastNote();
    this.block = document.getElementById('block');
    this.notes = structuredClone(this.data.notifications);

    this.nsg = notesGetted.subscribe((res) => {
      this.notes = structuredClone(this.data.notifications);
    });
  }

  readedColor(note: NoteModel) {
    if (note.is_readed) return { color: '#6c757d' };
    return {};
  }

  readLastNote() {
    let needSend = false;
    let arr: number[] = [];
    this.data.notifications.forEach((item: NoteModel) => {
      if (!item.is_readed) {
        arr.push(item.id);
        needSend = true;
      }
    });
    if (needSend) {
      let data = { ids: arr };
      this.data.noteService.SendMessage(data);
    }
  }

  onScroll(event: any) {
    if (this.block.scrollHeight - this.block.scrollTop < 1000) {
      let offset = this.data.offset.offset;
      let check = this.data.offset.check;
      if (!check.get(offset)) {
        this.store.dispatch(
          getNotes({ parametr: { limit: 50, offset: offset } })
        );
        check.set(offset, true);
      }
    }
  }
}
