import { FormsModule } from '@angular/forms';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Color } from '@ionic/core';
import { CdkTreeModule } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonText,
} from '@ionic/angular/standalone';
import { TreeBase } from '../../models/tree-base';
import { TodoItem } from '../../models/todo-item';

@Component({
  selector: 'cdk-tree-select',
  template: `
    <cdk-tree [dataSource]="treeData" [treeControl]="treeControl">
      <!-- This is the tree node template for leaf nodes -->
      <cdk-nested-tree-node
        *cdkTreeNodeDef="let node"
        class="child-node tree-node"
      >
        <!-- use a disabled button to provide padding for tree leaf -->
        <ion-item lines="none" class="flex items-center tree-node">
          <ion-checkbox
            class="tree-node"
            [(ngModel)]="node.selected"
            (ionChange)="clickNode(node)"
            label-placement="end"
            justify="start"
          >
            {{ node.name }}
          </ion-checkbox>
        </ion-item>
      </cdk-nested-tree-node>
      <!-- This is the tree node template for expandable nodes -->
      <cdk-nested-tree-node
        *cdkTreeNodeDef="let node; when: hasChild"
        class="tree-node"
      >
        <ion-item lines="none" class="flex items-center">
          <ion-button
            cdkTreeNodeToggle
            (click)="node.expanded = !node.expanded"
            [size]="buttonSize"
            slot="start"
            fill="clear"
            [color]="buttonColor"
          >
            <ion-icon
              slot="icon-only"
              [name]="
                treeControl.isExpanded(node)
                  ? 'chevron-down'
                  : 'chevron-forward'
              "
            >
            </ion-icon>
          </ion-button>
          <ion-checkbox
            [indeterminate]="descendantsPartiallySelected(node)"
            [checked]="descendantsAllSelected(node)"
            (ionChange)="parentSelectionToggle(node); clickNode(node)"
            label-placement="end"
            justify="start"
          >
            {{ node.name }}
          </ion-checkbox>
        </ion-item>

        <div [class.tree-invisible]="!isExpanded(node)">
          <ng-container cdkTreeNodeOutlet></ng-container>
        </div>
      </cdk-nested-tree-node>
    </cdk-tree>
  `,
  standalone: true,
  styles: `
  ion-item{
    background:transparent;
    --background:transpartent;
  }
  ion-button{
    margin:0;
  }
  .tree-invisible {
  display: none;
}

.tree-node {
  display: block;
}

.tree-node .tree-node {
  padding-left: 40px;
}

  `,
  imports: [
    CdkTreeModule,
    FormsModule,
    IonCheckbox,
    IonItem,
    IonButton,
    IonIcon,
    IonText,
    IonNote,
    IonLabel,
  ],
})
export class CdkTreeSelectComponent
  extends TreeBase<TodoItem>
  implements OnChanges
{
  @Input() public buttonSize: 'default' | 'large' | 'small' | undefined =
    'default';
  @Input() public buttonColor: Color = 'medium';
  @Input() data: TodoItem[] = [];
  @Output() public selectChangeEvent = new EventEmitter<TodoItem[]>();

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data'] && changes['data'].currentValue) {
      const data = changes['data'].currentValue;
      this.treeData = new ArrayDataSource(data);
      this.treeControl.dataNodes = data;
    }
  }

  public override clickNode(node: TodoItem): void {
    super.clickNode(node);
    this.selectChangeEvent.next(this.selectionModel.selected);
  }
}
