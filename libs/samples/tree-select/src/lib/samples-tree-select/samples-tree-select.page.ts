import { addIcons } from 'ionicons';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeSelectComponent } from '@cs/components/tree-select';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { caretDownOutline, caretUpOutline } from 'ionicons/icons';

@Component({
  selector: 'ionic-component-snippets-samples-tree-select',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    TreeSelectComponent,
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
      <tree-select
        [items]="treeviewItems"
        [persistedName]="'persistedName'"
        [treeViewName]="'treeViewName'"
        (itemCheckedEvent)="itemChecked($event)"
      >
      </tree-select>
    </ion-content>
  `,
  styles: [],
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
  };
  constructor() {
    addIcons(this.iconMaps);
  }

  itemChecked(e: any) {
    console.log(e);
  }
}
