export class ShortCityModel {
  constructor(
    public id: number,
    public name: string,
    public region_id: number
  ) {}
}

export class RegionModel {
  constructor(public name: string, public id: number) {}
}
export class CityModel {
  constructor(public id: number, public name: string, public region: RegionModel) {}
}
export class CityUpdateModel {
  constructor(
    public id?: number,
    public name?: string,
    public region_id?: number,
    public region_name?: number
  ) {}
}
