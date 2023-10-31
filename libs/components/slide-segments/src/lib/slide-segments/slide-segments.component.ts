import {
  Subject,
  debounceTime,
  fromEvent,
  take,
  takeUntil,
  throttleTime,
} from "rxjs";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToggle,
  IonicSlides,
  SelectChangeEventDetail,
} from "@ionic/angular/standalone";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";

export interface ISegmentButton {
  label: string;
  value: string;
}
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: "ionic-component-snippets-slide-segments",
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonItem,
    IonIcon,
    IonToggle,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
  template: `
  <ion-content>
    <ion-segment
      #mySegment
      (ionChange)="segmentHandleChange($any($event))"
      [scrollable]="scrollable"
      [value]="selectedSegment"
    >
      <ion-segment-button
        *ngFor="let segmentButton of segmentButtons"
        [value]="segmentButton.value"
      >
        <ion-label>{{ segmentButton.label }}</ion-label>
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
      <ng-container *ngFor="let segmentButton of segmentButtons">
        <swiper-slide>
          <ng-container *ngIf="segmentButton.value === selectedSegment">
            {{ segmentButton.label }}
          </ng-container>
        </swiper-slide>
      </ng-container>
    </swiper-container>
  </ion-content>
  `,
  styles: [
    `
      swiper-container {
        height: 300px;

        --swiper-pagination-bullet-inactive-color: rgb(
          var(--ion-color-primary-rgb),
          0.5
        );
        --swiper-pagination-color: var(--ion-color-primary);
        --swiper-scrollbar-bg-color: var(--ion-color-light);
      }
    `,
  ],
})
export class SlideSegmentsComponent implements OnChanges, OnInit, OnDestroy {
  swiperModules = [IonicSlides];
  @Input() scrollable = true;
  @Input() autoHeight = false;
  @Input() lazy = false;
  @Input() segmentButtons: ISegmentButton[] = [];
  @Input() selectedSegment = "";

  _swiperRef: ElementRef | undefined = undefined;
  @ViewChild("swiperRef")
  swiperRef: ElementRef | undefined = undefined;
  @ViewChild("mySegment", { static: true }) segment!: IonSegment;
  private destroy$ = new Subject<boolean>();
  private swiperInstance: any;
  constructor(private zone: NgZone) { }

  resize() {
    fromEvent(window, "resize")
      .pipe(debounceTime(300), throttleTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        console.log("Page RESIZE");
        this.swiperInstance?.updateAutoHeight(50);
      });
  }
  ngOnInit() {
    console.log(this.segmentButtons);
    this.selectedSegment = this.segmentButtons[0].value;
    console.log(this.selectedSegment);
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
    this.swiperInstance.slideTo(
      this.segmentButtons.findIndex((d) => d.value === e.detail.value)
    );
  }
  slideWillChange() {
    console.log("slideWillChange");
    // this.selectedSegment = this.segmentButtons[
    //   this.swiperInstance.activeIndex
    // ].value;
  }

  slideDidChange() {
    if (!this.swiperInstance) return;
    this.selectedSegment = this.segmentButtons[
      this.swiperInstance.activeIndex
    ].value;

    this.swiperInstance.updateAutoHeight(50);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["segmentButtons"].currentValue?.length > 0) {
      if (!this.selectedSegment) {
        this.selectedSegment = this.segmentButtons[0].value;
        this.segment.writeValue(this.selectedSegment);
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
