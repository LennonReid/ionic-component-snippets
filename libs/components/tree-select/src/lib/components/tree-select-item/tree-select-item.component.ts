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
import { Color } from '@ionic/core';

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
      <!-- <div class="icon">
          </div> -->
      <ion-item [lines]="'none'">
        @if (couldBeCollapse(item)) { @if (item.items.collapsed) {
        <ion-button
          [size]="buttonSize"
          slot="start"
          fill="clear"
          [color]="buttonColor"
          (click)="collapseItem(item)"
        >
          <ion-icon slot="icon-only" name="caret-down-outline"></ion-icon>
        </ion-button>
        } @else {
        <ion-button
          [size]="buttonSize"
          slot="start"
          fill="clear"
          [color]="buttonColor"
          (click)="collapseItem(item)"
        >
          <ion-icon slot="icon-only" name="caret-forward-outline"></ion-icon>
        </ion-button>
        } } @else {
        <ion-button
          class="noVisibility"
          [size]="buttonSize"
          slot="start"
          fill="clear"
          [color]="buttonColor"
          (click)="collapseItem(item)"
        >
          <ion-icon slot="icon-only" name="caret-down-outline"></ion-icon>
        </ion-button>
        }
        <ion-checkbox
          id="check-bh-{{ item.id }}"
          [indeterminate]="hasCheckedChild(item)"
          [(ngModel)]="item.checked"
          (ngModelChange)="checkChanged()"
          label-placement="end"
        >
          {{ item.text }}
        </ion-checkbox>
      </ion-item>
    </ion-grid>
    }
  `,
  styles: `
    .noVisibility {
      visibility: hidden;
    }
    ion-button {
      margin-right: 0.5rem;
    }
    ion-checkbox::part(label) {
      width: 100%;
    }

    .icon {
      min-width: 2rem; /* 32px */
    }

    .tree-item-row {
      display: flex;
      align-items: center !important;
      flex-wrap: nowrap;
    }
  `,
  standalone: true,
})
export class TreeSelectItemComponent implements OnInit {
  @Input() public item?: ITreeItem;
  @Input() public persistedName = '';
  @Input() public treeViewName = '';
  @Input() public buttonSize: 'default' | 'large' | 'small' | undefined =
    'default';
  @Input() public buttonColor: Color = 'medium';

  @Output() itemCheckedEvent = new EventEmitter<ITreeItemChecked>();

  constructor(
    public treeViewService: TreeViewService,
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

  public hasCheckedChild = (treeItem: ITreeItem): boolean => {
    return (
      this.treeViewService.anyChildChecked(treeItem?.items) && !treeItem.checked
    );
  };
}
