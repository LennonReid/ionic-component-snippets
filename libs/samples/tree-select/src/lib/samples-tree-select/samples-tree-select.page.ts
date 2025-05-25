import { addIcons } from 'ionicons';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTreeSelectComponent, TodoItem } from 'ion-cdk-tree-select';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import {
  caretDownOutline,
  caretUpOutline,
  chevronDown,
  chevronForward,
} from 'ionicons/icons';
import { DataService } from '../data-service';

@Component({
    selector: 'ionic-component-snippets-samples-tree-select',
    imports: [
        CommonModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        CdkTreeSelectComponent,
    ],
    template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>tree-select Samples</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-content>
        <ion-cdk-tree-select
          [data]="treeData"
          [iconSize]="'default'"
          [fontSize]="'1.25rem'"
          [expandedIconName]="'caret-forward-outline'"
          [collapsedIconName]="'caret-down-outline'"
          (selectChangeEvent)="selectChangeEvent($event)"
        >
        </ion-cdk-tree-select>
      </ion-content>
    </ion-content>
  `,
    styles: []
})
export class SamplesTreeSelectPage {
  public treeviewItems = [
    { id: 1, name: 'Furniture' },
    { id: 2, name: 'Tables', parentId: 1 },
    { id: 3, name: 'Chair', parentId: 1 },
    { id: 4, name: 'Sofas', parentId: 1 },
    { id: 5, name: 'Sofa 1', parentId: 4 },
    { id: 12, name: 'Sofa 2', parentId: 5 },
    { id: 121, name: 'Sofa 3', parentId: 12 },
    { id: 6, name: 'Little table', parentId: 2 },
    { id: 11, name: 'Little table 2', parentId: 2 },
    { id: 9, name: 'Little little table', parentId: 6 },
    { id: 7, name: 'Decor' },
    { id: 8, name: 'Outdoor' },
  ];

  readonly iconMaps: any = {
    'caret-down-outline': caretDownOutline,
    'caret-up-outline': caretUpOutline,
    chevronDown,
    chevronForward,
  };
  treeData: TodoItem[] = [];
  constructor(private dataService: DataService) {
    addIcons(this.iconMaps);
    this.dataService.FakeTreeData.subscribe({
      next: (data) => {
        this.treeData = data;
      },
    });
  }

  selectChangeEvent(e: any) {
    console.log(e);
  }
}
