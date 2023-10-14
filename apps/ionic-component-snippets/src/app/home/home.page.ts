import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { IonicModule } from '@ionic/angular'

@Component({
  imports: [IonicModule, RouterModule],
  selector: 'ionic-component-snippets-home',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Blank </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-item button routerLink="/calendar" detail>
          <ion-label>Sample Calendar</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [``],
  standalone: true
})
export class HomePage {
  constructor() { }
}
