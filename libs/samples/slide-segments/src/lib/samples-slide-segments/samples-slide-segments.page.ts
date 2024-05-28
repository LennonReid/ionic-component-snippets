import { Component } from '@angular/core';
import {
  ISegmentButton,
  SlideSegmentsComponent,
} from '@cs/components/slide-segments';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-component-snippets-samples-slide-segments',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    SlideSegmentsComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Slide-segments Samples</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ionic-component-snippets-slide-segments
        [scrollable]="true"
        [segmentButtons]="segmentButtons"
      ></ionic-component-snippets-slide-segments>
    </ion-content>
  `,
})
export class SamplesSlideSegmentsPage {
  segmentButtons: ISegmentButton[] = [];
  constructor() {
    for (let index = 1; index < 6; index++) {
      this.segmentButtons.push({
        label: `segment${index}`,
        value: `segment${index}`,
      });
    }
  }
}
