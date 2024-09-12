import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'groupByDate' })
export class GroupByPipe implements PipeTransform {
  transform(
    collection: Array<any>,
    order: boolean = true,
    property: string = 'created_at_copy'
  ): Array<any> | null {
    if (!collection) {
      return null;
    }
    for (let i = 0; i < collection.length; i++) {
      collection[i]['created_at_copy'] = collection[i]['created_at']
        .toString()
        .split('T')
        .slice(0, 1)
        .join(' ');
    }
    const gc = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }
      return previous;
    }, {});

    let sortedKeys = Object();
    if (order) {
      sortedKeys = Object.keys(gc).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
    } else {
      sortedKeys = Object.keys(gc).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );
    }
    const sortedData = sortedKeys.reduce((obj: any, key: any) => {
      obj[key] = gc[key];
      return obj;
    }, {});

    return Object.keys(sortedData).map((key) => ({
      key,
      value: sortedData[key],
    }));
  }
}
