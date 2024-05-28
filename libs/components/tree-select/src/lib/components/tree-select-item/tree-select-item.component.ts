import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeViewService } from '../../services/tree-view.service';
import { TreeViewEventService } from '../../services/tree-view-event.service';
import { ITreeItemChecked, ITreeItem } from '../../models/tree-item.interfaces';
import {
  IonButton,
  IonCheckbox,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  imports: [
    IonGrid,
    IonRow,
    IonIcon,
    IonItem,
    IonCheckbox,
    IonLabel,
    IonButton,
    FormsModule,
    NgClass,
  ],
  selector: 'tree-select-item',
  template: `
    @if (item) {
    <ion-grid class="ion-no-padding">
      <ion-row class="tree-item-row">
        <div class="icon">
          @if (couldBeCollapse(item)) { @if (item.items.collapsed) {
          <ion-button fill="clear" color="dark" (click)="collapseItem(item)">
            <ion-icon
              [size]="iconSize"
              slot="icon-only"
              name="chevron-forward-outline"
            ></ion-icon>
          </ion-button>
          }@else {
          <ion-button fill="clear" color="dark" (click)="collapseItem(item)">
            <ion-icon
              [size]="iconSize"
              slot="icon-only"
              name="chevron-down-outline"
            ></ion-icon>
          </ion-button>
          } }
        </div>
        <ion-item [lines]="'none'">
          <ion-checkbox
            id="check-bh-{{ item.id }}"
            [indeterminate]="hasCheckedChild(item)"
            slot="start"
            class="checkbox checked"
            [(ngModel)]="item.checked"
            (ngModelChange)="checkChanged()"
          ></ion-checkbox>
          <ion-label>{{ item.text }}</ion-label>
        </ion-item>
      </ion-row>
    </ion-grid>
    }
  `,
  styles: `
    .checkbox {
    margin: 0px 1.25rem 0px 0px;
}

.icon {
    min-width: 2rem; /* 32px */

}

.tree-item-row {
    display: flex;
    align-items: center !important;
    flex-wrap:nowrap;
}
    `,
  standalone: true,
})
export class TreeSelectItemComponent implements OnInit {
  @Input() public item?: ITreeItem;
  @Input() public persistedName = '';
  @Input() public treeViewName = '';
  @Input() public childCheked = false;
  @Input() public iconSize: 'default' | 'large' | 'small' | undefined =
    'default';

  @Output() itemCheckedEvent = new EventEmitter<ITreeItemChecked>();

  constructor(
    private treeViewService: TreeViewService,
    private eventService: TreeViewEventService
  ) {}

  public ngOnInit() {
    if (
      !!this.item &&
      this.item.checked !== null &&
      this.item.checked !== undefined
    ) {
      this.item.checked = false;
    }
  }

  public collapseItem(treeItem: ITreeItem) {
    this.treeViewService.collapseItem(treeItem);
  }

  public checkChanged(): void {
    this.eventService.checkChanged(
      this.item,
      this.treeViewName,
      this.persistedName
    );

    this.itemCheckedEvent.emit(<ITreeItemChecked>{
      checked: this.item?.checked,
      id: this.item?.id,
    });
  }

  public couldBeCollapse = (treeItem: ITreeItem): boolean =>
    treeItem.items?.length !== 0 &&
    treeItem.items.collapsed !== null &&
    treeItem.items.collapsed !== undefined;

  public hasCheckedChild = (treeItem: ITreeItem): boolean =>
    !!this.childCheked && !treeItem.checked;
}
