import { CommonMaterialModel } from '../backend/activity_task.model';
import { CommonTypeModel } from '../backend/type.model';

export class CardModel {
  constructor(
    public name: string,
    public img: string,
    public created_at: Date,
    public type: CommonTypeModel,
    public text: string,
    public materials: CommonMaterialModel
  ) {}
}
