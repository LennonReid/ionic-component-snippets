import { IonicModule } from '@ionic/angular';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISegmentButton, SlideSegmentsComponent } from '@cs/components/slide-segments';

@Component({
  selector: 'ionic-component-snippets-samples-slide-segments',
  standalone: true,
  imports: [CommonModule, IonicModule, SlideSegmentsComponent],
  template: `
  <ionic-component-snippets-slide-segments [segmentButtons]="segmentButtons"></ionic-component-snippets-slide-segments>
  `,
  styles: [],
})
export class SamplesSlideSegmentsPage {
  segmentButtons: ISegmentButton[] = []
  constructor() {
    for (let index = 1; index < 6; index++) {
      this.segmentButtons.push({
        label: `segment${index}`,
        value: `segment${index}`
      })
    }
  }
}
