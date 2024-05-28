import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeViewService } from '../../services/tree-view.service';
import { TreeViewDataService } from '../../services/tree-view-data.service';
import { ITreeItemChecked, ITreeItem } from '../../models/tree-item.interfaces';
import { TreeSelectItemsComponent } from '../tree-select-items/tree-select-items.component';
import { Color } from '@ionic/core';

@Component({
  selector: 'tree-select',
  template: `
    @if (items && items.length > 0) { @for (item of treeViewItems; track $index)
    {
    <tree-select-items
      [buttonSize]="buttonSize"
      [buttonColor]="buttonColor"
      [treeViewName]="treeViewName"
      [persistedName]="persistedName"
      [item]="item"
      (itemCheckedEvent)="itemChecked($event)"
    ></tree-select-items>
    } }
  `,
  standalone: true,
  imports: [TreeSelectItemsComponent],
})
export class TreeSelectComponent implements OnInit {
  @Input() public items: any;
  @Input() public persistedName = '';
  @Input() public treeViewName = '';

  @Input() public buttonSize: 'default' | 'large' | 'small' | undefined =
    'default';
  @Input() public buttonColor: Color = 'medium';
  @Output() public itemCheckedEvent = new EventEmitter<ITreeItemChecked>();

  public treeViewItems?: ITreeItem[];
  private itemLevel = 1;
  private tempArray: any[] = [];

  constructor(
    private dataService: TreeViewDataService,
    private treeViewService: TreeViewService
  ) {}

  ngOnInit() {
    this.dataService.setItemsByName(this.items, this.treeViewName);

    this.treeViewService.readOnLocalStorageCheckItems(
      this.persistedName,
      this.treeViewName,
      this.items
    );

    if (!this.getTreeView()) {
      this.initTreeView();
    }

    this.treeViewItems = this.getTreeView();
  }

  public getTreeViewByName(name: string) {
    return this.dataService.getTreeViewItemsByName(name);
  }

  public addTreeViewByName(treeView: any, name: string): void {
    this.dataService.setTreeViewItemsByName(treeView, name);
  }

  public itemChecked(treeItemChecked: ITreeItemChecked) {
    this.itemCheckedEvent.emit(treeItemChecked);
  }

  private initTreeView(): void {
    this.addTreeViewByName(this.generateTree(), this.treeViewName);
    this.treeViewService.collapseItem(this.getTreeView());
  }

  private generateTree(): any {
    const treeViewItems: any = [];
    this.itemLevel = 1;

    this.items
      .filter((e: any) => !e.parentId)
      .forEach((value: any) => {
        treeViewItems.push(
          this.treeViewService.createNewItem(
            value,
            this.itemLevel,
            this.treeViewName
          )
        );
      });

    this.itemLevel++;
    this.createItemsLevelTwo(this.items, treeViewItems);
    return treeViewItems;
  }

  private createItemsLevelTwo(treeData: any[], treeViewItems: any[]) {
    treeData = this.getItemsToAddInTreeView(treeData, treeViewItems);

    treeData
      .filter((e) => e.parentId)
      .forEach((itemToAdd, ckikey) => {
        treeViewItems.forEach((item, tvikey) => {
          if (itemToAdd.parentId === item.id) {
            item.items.push(
              this.treeViewService.createNewItem(
                itemToAdd,
                this.itemLevel,
                this.treeViewName
              )
            );
          } else if (item.items && item.items.length !== 0) {
            item = this.createItemsOfLevelHigherThanTwo(
              itemToAdd,
              item,
              this.itemLevel + 1
            );
          }
        });
      });

    this.itemLevel++;

    if (treeData && treeData.length > 0) {
      this.tempArray = [];
      this.createItemsLevelTwo(this.items, treeViewItems);
    }
  }

  private createItemsOfLevelHigherThanTwo(
    treeDataItemToAdd: any,
    treeViewChild: any,
    itemLevel: number
  ): any {
    treeViewChild.items.forEach((child: any, key: string) => {
      if (treeDataItemToAdd.parentId === child.id) {
        const itemExist = child.items.filter((e: any) => e.id === child.id);
        if (!itemExist || (itemExist && itemExist.length === 0)) {
          child.items.push(
            this.treeViewService.createNewItem(
              treeDataItemToAdd,
              itemLevel,
              this.treeViewName
            )
          );
        }
      } else if (child.items && child.items.length !== 0) {
        child = this.createItemsOfLevelHigherThanTwo(
          treeDataItemToAdd,
          child,
          itemLevel + 1
        );
      }
    });

    return treeViewChild;
  }

  private getItemsToAddInTreeView(
    treeData: any[],
    treeViewItems: any[]
  ): any[] {
    const tempTree = Object.assign([], treeData);
    treeData = [];
    tempTree.forEach((elem: any) => {
      this.tempArray = [];
      const findElem = this.returnFlattenedArray(treeViewItems).filter(
        (e) => e.id === elem.id
      );
      if (!findElem || (findElem && findElem.length === 0)) {
        treeData.push(elem);
      }
    });

    return treeData;
  }

  private returnFlattenedArray(items: any[]): any[] {
    if (!this.tempArray) {
      this.tempArray = [];
    }
    this.tempArray = this.tempArray.concat(items);

    items.forEach((value, key) => {
      if (value.items !== undefined) {
        this.returnFlattenedArray(value.items);
      }
    });

    return this.tempArray;
  }

  private getTreeView(): any {
    return this.getTreeViewByName(this.treeViewName);
  }
}
