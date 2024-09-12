import { NoteModel } from '../models/backend/note.model';
import { NoteService } from '../services/note.service';

export class Offset2Side {
  constructor(
    public offset: number | undefined,
    public check: Map<number | undefined, boolean>
  ) {}
}
export class DialogNotesMoreData {
  constructor(
    public notifications: NoteModel[],
    public offset: Offset2Side,
    public noteService: NoteService
  ) {}
}
