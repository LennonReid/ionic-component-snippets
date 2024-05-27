import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITreeItem } from '../../models/tree-item.interfaces';
import { ITreeItemChecked } from '../../models/tree-item.interfaces';
import { TreeViewService } from '../../services/tree-view.service';
import { IonItem, IonList } from '@ionic/angular/standalone';
import { TreeSelectItemComponent } from '../tree-select-item/tree-select-item.component';

@Component({
  selector: 'tree-select-items',
  template: `
    @if (item) {
    <ion-item [lines]="'none'" class="{{ 'itemLevel-' + item.itemLevel }}">
      <tree-select-item
        [item]="item"
        [iconSize]="iconSize"
        [treeViewName]="treeViewName"
        [persistedName]="persistedName"
        [childCheked]="anyChildChecked(item)"
        (itemCheckedEvent)="itemChecked($event)"
      ></tree-select-item>
    </ion-item>
    @for (loopItem of item.items; track $index) {
    <ion-list class="ion-no-padding" [hidden]="loopItem.collapsed">
      <tree-select-items
        [item]="loopItem"
        [iconSize]="iconSize"
        [treeViewName]="treeViewName"
        [persistedName]="persistedName"
        (itemCheckedEvent)="itemChecked($event)"
      ></tree-select-items>
    </ion-list>

    } }
  `,
  styles: `

  .itemLevel-1 {
      padding-left: 0px;
  }
  .itemLevel-2 {
    margin-left: 1.5rem;
  }
  .itemLevel-3 {
    margin-left:3rem;
  }
  .itemLevel-4 {
    margin-left: 4.5rem;
  }
  .itemLevel-5 {
    margin-left: 6rem;
  }
  .itemLevel-6 {
    margin-left: 7.5rem;
  }
  .itemLevel-7 {
    margin-left: 9rem;
  }
  .itemLevel-8 {
    margin-left: 10.5rem;
  }
  .itemLevel-9 {
    margin-left: 12rem;
  }
  .itemLevel-10 {
    margin-left: 13.5rem;
  }
  .itemLevel-11 {
    margin-left: 15rem;
  }
  `,
  standalone: true,
  imports: [IonList, IonItem, TreeSelectItemComponent],
})
export class TreeSelectItemsComponent {
  @Input() public item?: ITreeItem;
  @Input() public persistedName = '';
  @Input() public treeViewName = '';
  @Input() public iconSize: 'default' | 'large' | 'small' | undefined =
    'default';

  @Output() public itemCheckedEvent = new EventEmitter<ITreeItemChecked>();

  constructor(private treeViewService: TreeViewService) {}

  public anyChildChecked(item: ITreeItem): boolean {
    return this.treeViewService.anyChildChecked(item.items);
  }

  public itemChecked(treeItemChecked: ITreeItemChecked) {
    this.itemCheckedEvent.emit(treeItemChecked);
  }
}
