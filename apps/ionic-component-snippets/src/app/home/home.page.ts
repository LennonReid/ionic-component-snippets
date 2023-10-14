import { CommonModule } from '@angular/common';
import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { IonicModule } from '@ionic/angular'

export interface ISampleItem {
  routerLink: string;
  label: string;
}
@Component({
  imports: [CommonModule, IonicModule, RouterModule],
  selector: 'ionic-component-snippets-home',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Samples </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-item *ngFor="let sample of samples" button [routerLink]="sample.routerLink" detail>
          <ion-label>{{sample.label}}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [``],
  standalone: true
})
export class HomePage {
  constructor() { }
  samples: ISampleItem[] = [
    {
      routerLink: '/calendar',
      label: 'Sample Calendar'
    },
    {
      routerLink: '/select-search',
      label: 'Sample select-search'
    },
  ]
}
