import { VacancyModel } from "../models/backend/vacancy.model";

export class Item {
  constructor(
    public name: string,
    public ava: string,
    public url: string,
    public description?: string
  ) {}
}

export interface DialogItemsMoreData {
  items: Item[];
  title: string;
}

export interface DialogVacanciesMoreData {
  items: VacancyModel[];
  title: string;
}
