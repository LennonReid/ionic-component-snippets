import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { faker } from '@faker-js/faker';
import { TodoItem } from 'ion-cdk-tree-select';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private stopAtDepth = 4;
  public FakeTreeData = new BehaviorSubject<TodoItem[]>([]);

  constructor() {
    this.FakeTreeData.next(this.GenerateRandomTree(1, 1));
  }

  private GenerateRandomTree(count: number, level: number): TodoItem[] {
    const array: TodoItem[] = [];
    for (let index = 0; index < count; index++) {
      array.push(<TodoItem>{
        id: faker.string.uuid(),
        name: faker.internet.displayName(),
        expanded: false,
        children:
          level <= this.stopAtDepth
            ? this.GenerateRandomTree(
                faker.number.int({ min: 1, max: 4 }),
                level + 1
              )
            : [],
      });
    }
    return array;
  }
}
