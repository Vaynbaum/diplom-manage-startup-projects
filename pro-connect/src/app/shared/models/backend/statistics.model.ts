export class CreatedStatisticsModel {
  constructor(public date: string[], public cnt: number[]) {}
}

export class StatusActivityStatisticsModel {
  constructor(
    public all: number[],
    public no_group: number[],
    public status: string[]
  ) {}
}
export class ActivityStatisticsModel {
  constructor(
    public created: CreatedStatisticsModel,
    public status: StatusActivityStatisticsModel
  ) {}
}
export class GroupStatisticsModel {
  constructor(public created: CreatedStatisticsModel) {}
}
export class StatisticsModel {
  constructor(
    public activity: ActivityStatisticsModel,
    public group: GroupStatisticsModel
  ) {}
}
export class ColumnActivityStatisticsModel {
  constructor(public xaxis: string[], public series: any[]) {}
}
