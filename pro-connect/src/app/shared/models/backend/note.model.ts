export class NoteModel {
  constructor(
    public id: number,
    public text: string,
    public user_abstract_id: number,
    public is_readed: boolean,
    public created_at: Date | string
  ) {}
}
export class ReadedNotesModel {
  constructor(public ids: number[], public readed: boolean) {}
}
