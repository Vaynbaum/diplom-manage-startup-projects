export class ResponseItemsModel<Type> {
  constructor(
    public items: Type[],
    public count: number,
    public offset?: number
  ) {}
}
