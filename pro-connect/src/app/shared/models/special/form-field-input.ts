import { Observable, map, startWith } from 'rxjs';
import { P_FIELD_EMMPTY } from '../../phrases';

export class FormFieldInput {
  constructor(
    public label: string,
    public formControl: any,
    public _placeholder?: string,
    public _icon?: string,
    public _type?: string,
    public is_enable_btn = false,
    public hide = false,
    public is_date = false,
    public items: any[] = [],
    public values: Observable<any[]> = new Observable()
  ) {}

  public get type() {
    if (this._type) return this._type;
    return '';
  }
  public get placeholder() {
    if (this._placeholder) return this._placeholder;
    return '';
  }

  public set placeholder(value: string) {
    this._placeholder = value;
  }

  public get icon() {
    if (this._icon) return this._icon;
    return '';
  }

  public action_btn() {}

  public loadData(items: []) {}

  public loadingData() {}

  protected compile_values() {
    return this.formControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        value ? this._filterValues(value, this.items) : this.items.slice()
      )
    );
  }

  protected _filterValues(value: any, items: any[]) {
    if (value.constructor == Array) return items;
    else
      return items.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
  }

  public messageError() {
    let e = this.formControl?.['errors'];
    if (e?.['required']) return P_FIELD_EMMPTY;
    return '';
  }
}
