import { Subject, debounceTime, fromEvent, take, takeUntil, throttleTime } from 'rxjs';
import { IonSegment, IonicModule, IonicSlides, SelectChangeEventDetail } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ISegmentButton {
  label: string;
  value: string;
}
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'ionic-component-snippets-slide-segments',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `

  <ion-segment #mySegment
            (ionChange)="segmentHandleChange($any($event))" scrollable="scrollable" [value]="selectedSegment">
    <ion-segment-button *ngFor="let segmentButton of segmentButtons" [value]="segmentButton.value">
      <ion-label>{{segmentButton.label}}</ion-label>
    </ion-segment-button>
  </ion-segment>
      <swiper-container
        [modules]="swiperModules"
        #swiperRef
        [autoHeight]="autoHeight"
        [lazy]="lazy"
        (slidechangetransitionstart)="slideWillChange()"
        (slidechangetransitionend)="slideDidChange()"
      >
  <swiper-slide>Slide 1</swiper-slide>
  <swiper-slide>Slide 2</swiper-slide>
  <swiper-slide>Slide 3</swiper-slide>
</swiper-container>
  `,
  styles: [],
})
export class SlideSegmentsComponent implements OnChanges, OnDestroy {
  swiperModules = [IonicSlides];
  @Input() scrollable = true;
  @Input() autoHeight = false;
  @Input() lazy = false;
  @Input() selectedSegment = '';
  @Input() segmentButtons: ISegmentButton[] = [{
    label: 'segment1',
    value: 'segment2'
  }]

  _swiperRef: ElementRef | undefined = undefined;
  @ViewChild('swiperRef')
  swiperRef: ElementRef | undefined = undefined;
  @ViewChild('mySegment', { static: true }) segment!: IonSegment;
  private destroy$ = new Subject<boolean>();
  private swiperInstance: any;
  constructor(
    private zone: NgZone
  ) {
    // for (let index = 1; index < 6; index++) {
    //   this.segmentButtons.push({
    //     title: `segment${index}`,
    //     value: `segment${index}`
    //   })
    // }
  }

  resize() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(300), throttleTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Page RESIZE');
        this.swiperInstance?.updateAutoHeight(50);
      });
  }
  ionViewDidEnter() {
    this.zone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this.swiperInstance = this.swiperRef?.nativeElement.swiper;
        this.swiperInstance?.updateAutoHeight(50);
        this.resize();
      });
  }

  segmentHandleChange(e: CustomEvent<SelectChangeEventDetail>) {
    this.selectedSegment = e.detail.value;
    this.swiperInstance.slideTo(this.segmentButtons.findIndex((d) => d.value === e.detail.value));
  }
  slideWillChange() {
    console.log('slideWillChange');
  }

  slideDidChange() {
    if (!this.swiperInstance) return;
    this.selectedSegment = this.segmentButtons[this.swiperInstance.activeIndex].value;

    this.swiperInstance.updateAutoHeight(50);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['segmentButtons'].firstChange && changes['segmentButtons'].currentValue?.length > 0) {
      if (!this.selectedSegment) {
        this.selectedSegment = this.segmentButtons[0].value;
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
