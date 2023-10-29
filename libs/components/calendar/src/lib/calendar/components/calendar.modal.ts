import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { IonContent, ModalController, NavParams, ScrollDetail } from '@ionic/angular/standalone';
import { CalendarDay, CalendarModalOptions, CalendarMonth, InternalCalendarModalOptions } from '../calendar.model';
import { CalendarService } from '../services/calendar.service';
import * as moment from 'moment';

import { addIcons } from 'ionicons';
import {
  close, checkmark
} from 'ionicons/icons';

import { pickModes } from '../config';

const NUM_OF_MONTHS_TO_CREATE = 6;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ion-calendar-modal',
  styleUrls: ['./calendar.modal.scss'],
  template: `
    <ion-header>
      <ion-toolbar [color]="_d.color || ''">
        <ion-buttons slot="start">
          <ion-button type="button" slot="icon-only" fill="clear" (click)="onCancel()">
            <span *ngIf="_d.closeLabel !== '' && !_d.closeIcon">{{ _d.closeLabel }}</span>
            <ion-icon *ngIf="_d.closeIcon" name="close"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{ _d.title }}</ion-title>

        <ion-buttons slot="end">
          <ion-button type="button" *ngIf="!!_d.clearLabel" fill="clear" [disabled]="!canClear()" (click)="clear()">
            <span *ngIf="_d.clearLabel !== ''">{{ _d.clearLabel }}</span>
          </ion-button>
          <ion-button
            type="button"
            slot="icon-only"
            *ngIf="!_d.autoDone"
            fill="clear"
            [disabled]="!canDone()"
            (click)="done()"
          >
            <span *ngIf="_d.doneLabel !== '' && !_d.doneIcon">{{ _d.doneLabel }}</span>
            <ion-icon *ngIf="_d.doneIcon" name="checkmark"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ng-content select="[sub-header]"></ng-content>

      <ion-calendar-week [color]="_d.color || ''" [weekArray]="_d.weekdays || []" [weekStart]="_d.weekStart || 1">
      </ion-calendar-week>
    </ion-header>

    <ion-content
      (ionScroll)="onScroll($any($event))"
      class="calendar-page"
      [scrollEvents]="true"
      [ngClass]="{ 'multi-selection': _d.pickMode === 'multi' }"
    >
      <div #months>
        <ng-template ngFor let-month [ngForOf]="calendarMonths" [ngForTrackBy]="trackByIndex" let-i="index">
          <div
            class="month-box"
            [class.month-invisible]="!scrolledToInitialPosition"
            [attr.data-month]="_monthFormatYYYYMM(month.original.date)"
            [attr.id]="'month-' + i"
          >
            <h4 class="text-center month-title">{{ _monthFormat(month.original.date) }}</h4>
            <ion-calendar-month
              [month]="month"
              [pickMode]="_d.pickMode || ''"
              [isSaveHistory]="_d.isSaveHistory || false"
              [id]="_d.id"
              [color]="_d.color || ''"
              (change)="onChange($event)"
              [(ngModel)]="datesTemp"
            >
            </ion-calendar-month>
          </div>
        </ng-template>
      </div>

      <ion-infinite-scroll threshold="25%" (ionInfinite)="nextMonth($event)" position="bottom">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CalendarModal implements OnInit, AfterViewInit {
  @ViewChild(IonContent)
  public content!: IonContent;
  @ViewChild('months')
  public monthsEle!: ElementRef;

  @HostBinding('class.ion-page')
  public ionPage = true;

  @Input()
  public options!: CalendarModalOptions;

  public datesTemp: Array<CalendarDay> = [];
  public calendarMonths!: Array<CalendarMonth>;
  public step!: number;
  public showYearPicker!: boolean;
  public year!: number;
  public years!: Array<number>;
  public scrolledToInitialPosition = false;
  _scrollLock = false;
  public _d!: InternalCalendarModalOptions;
  public actualFirstTime!: number;
  public prependingMonths = false;

  constructor(
    private _renderer: Renderer2,
    public _elementRef: ElementRef,
    public params: NavParams,
    public modalCtrl: ModalController,
    public ref: ChangeDetectorRef,
    public calSvc: CalendarService,
  ) {
    addIcons({ close, checkmark })
  }

  ngOnInit(): void {
    this.init();
    this.initDefaultDate();
  }

  async ngAfterViewInit(): Promise<void> {
    this.findCssClass();
    if (this._d.canBackwardsSelected) {
      await this.backwardsMonth();
    }
    await this.scrollToDefaultDate();
  }

  init(): void {
    this._d = this.calSvc.safeOpt(this.options);
    this._d.showAdjacentMonthDay = false;
    this.step = this._d.step as number;
    if (this.step < this.calSvc.DEFAULT_STEP) {
      this.step = this.calSvc.DEFAULT_STEP;
    }

    const dateToUse = this.getDateToUse();

    this.calendarMonths = this.calSvc.createMonthsByPeriod(
      moment(dateToUse).startOf('month').subtract(2, 'months').valueOf(),
      this.findInitMonthNumber(this._d.defaultScrollTo, dateToUse) + this.step,
      this._d,
    );
  }

  initDefaultDate(): void {
    const { pickMode, defaultDate, defaultDateRange, defaultDates } = this._d;
    if (pickMode === pickModes.SINGLE) {
      if (defaultDate) {
        this.datesTemp[0] = this.calSvc.createCalendarDay(this._getDayTime(defaultDate), this._d);
      }
    } else if (pickMode === pickModes.RANGE) {
      if (defaultDateRange) {
        if (defaultDateRange.from) {
          this.datesTemp[0] = this.calSvc.createCalendarDay(this._getDayTime(defaultDateRange.from), this._d);
        }
        if (defaultDateRange.to) {
          this.datesTemp[1] = this.calSvc.createCalendarDay(this._getDayTime(defaultDateRange.to), this._d);
        }
      }
    } else if (pickMode === pickModes.MULTI) {
      if (defaultDates && defaultDates.length) {
        this.datesTemp = defaultDates.map((e) => this.calSvc.createCalendarDay(this._getDayTime(e), this._d));
      }
    } else {
      this.datesTemp = [];
    }
  }

  findCssClass(): void {
    const { cssClass } = this._d;
    if (cssClass) {
      cssClass.split(' ').forEach((_class: string) => {
        if (_class.trim() !== '') this._renderer.addClass(this._elementRef.nativeElement, _class);
      });
    }
  }

  onChange(data: any): void {
    const { pickMode, autoDone } = this._d;

    this.datesTemp = data;
    this.ref.detectChanges();

    if (pickMode !== pickModes.MULTI && autoDone && this.canDone()) {
      this.done();
    }

    this.repaintDOM();
  }

  onCancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  done(): void {
    const { pickMode } = this._d;

    this.modalCtrl.dismiss(this.calSvc.wrapResult(this.datesTemp, pickMode), 'done');
  }

  canDone(): boolean {
    if (!Array.isArray(this.datesTemp)) {
      return false;
    }
    const { pickMode, defaultEndDateToStartDate } = this._d;

    if (pickMode === pickModes.SINGLE) {
      return !!(this.datesTemp[0] && this.datesTemp[0].time);
    } else if (pickMode === pickModes.RANGE) {
      if (defaultEndDateToStartDate) {
        return !!(this.datesTemp[0] && this.datesTemp[0].time);
      }
      return !!(this.datesTemp[0] && this.datesTemp[1]) && !!(this.datesTemp[0].time && this.datesTemp[1].time);
    } else if (pickMode === pickModes.MULTI) {
      return this.datesTemp.length > 0 && this.datesTemp.every((e) => !!e && !!e.time);
    } else {
      return false;
    }
  }

  clear() {
    this.datesTemp = [];
    this.modalCtrl.dismiss(null, 'clear');
  }

  canClear() {
    return !!this.datesTemp[0];
  }

  nextMonth(event: any): void {
    if (this.prependingMonths) {
      return;
    }

    const len = this.calendarMonths.length;
    const final = this.calendarMonths[len - 1];
    const nextTime = moment(final.original.time).add(1, 'M').valueOf();
    const rangeEnd = this._d.to ? moment(this._d.to).subtract(1, 'M') : 0;

    if (len <= 0 || (rangeEnd !== 0 && moment(final.original.time).isAfter(rangeEnd))) {
      event.target.disabled = true;
      return;
    }

    this.calendarMonths.push(...this.calSvc.createMonthsByPeriod(nextTime, NUM_OF_MONTHS_TO_CREATE, this._d));
    event.target.complete();
    this.repaintDOM();
  }

  async backwardsMonth() {
    const first = this.calendarMonths[0];

    if (first.original.time <= 0) {
      this._d.canBackwardsSelected = false;
      return;
    }

    const firstTime = (this.actualFirstTime = moment(first.original.time)
      .subtract(NUM_OF_MONTHS_TO_CREATE, 'M')
      .valueOf());

    this.calendarMonths.unshift(...this.calSvc.createMonthsByPeriod(firstTime, NUM_OF_MONTHS_TO_CREATE, this._d));
    this.ref.detectChanges();
    await this.repaintDOM();
  }

  async scrollToDate(date: Date): Promise<void> {
    const dateToUse = this.getDateToUse();
    const monthSelector = moment(dateToUse).format('YYYY-MM');
    const element = document.querySelector(`[data-month="${monthSelector}"]`) as HTMLElement;
    if (!element) {
      return;
    }

    try {
      this._scrollLock = true;
      await this.waitForElementTop(element);
      const offsetMargin = 10;
      const defaultMonthScrollPosition = element.offsetTop - offsetMargin;
      await this.content.scrollToPoint(0, defaultMonthScrollPosition, 10);
      this._scrollLock = false;
      this.scrolledToInitialPosition = true;
    } catch (e) {
      this._scrollLock = false;
      this.scrolledToInitialPosition = true;
      console.error(`Could not scroll to month with index: ${monthSelector}`);
    }
  }

  private async waitForElementTop(element: any, timeout = 2000) {
    const start = Date.now();
    let now = 0;

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (element.offsetTop) {
          clearInterval(interval);
          resolve(element);
        }

        now = Date.now();

        if (now - start >= timeout) {
          reject(`Could not find the element  within ${timeout} ms`);
        }
      }, 50);
    });
  }

  async scrollToDefaultDate(): Promise<void> {
    await this.scrollToDate(this._d.defaultScrollTo);
  }

  async onScroll($event: CustomEvent<ScrollDetail>): Promise<void> {
    if (this._scrollLock || this.prependingMonths) {
      return;
    }

    const threshold = 100;
    const scrollElem = await this.content.getScrollElement();
    const currentY = $event.detail.scrollTop;
    const isOnTopOfScreen = currentY < threshold;
    if (!isOnTopOfScreen) {
      return;
    }
    this.prependingMonths = true;
    this._scrollLock = true;
    const heightBeforeMonthPrepend = scrollElem.scrollHeight;
    await this.backwardsMonth();

    const heightAfterMonthPrepend = scrollElem.scrollHeight;
    const heightAdded = heightAfterMonthPrepend - heightBeforeMonthPrepend;
    const scrollPositionToGo = heightAdded + 100; // NOTE: idk why 100 works

    await this.content.scrollToPoint(0, scrollPositionToGo, 1);
    this._scrollLock = false;
    setTimeout(() => {
      this.prependingMonths = false;
    }, 500);
  }

  /**
   * In some older Safari versions (observed at Mac's Safari 10.0), there is an issue where style updates to
   * shadowRoot descendants don't cause a browser repaint.
   * See for more details: https://github.com/Polymer/polymer/issues/4701
   */
  repaintDOM() {
    return this.content.getScrollElement().then((scrollElem) => {
      // Update scrollElem to ensure that height of the container changes as Months are appended/prepended
      scrollElem.style.zIndex = '2';
      scrollElem.style.zIndex = 'initial';
      // Update monthsEle to ensure selected state is reflected when tapping on a day
      this.monthsEle.nativeElement.style.zIndex = '2';
      this.monthsEle.nativeElement.style.zIndex = 'initial';
    });
  }

  findInitMonthNumber(date: Date, fromDate = this._d.from): number {
    let startDate = this.actualFirstTime ? moment(this.actualFirstTime) : moment(fromDate);
    const defaultScrollTo = moment(date);
    const isAfter: boolean = defaultScrollTo.isAfter(startDate);
    if (!isAfter) return -1;

    if (this.showYearPicker) {
      startDate = moment(new Date(this.year, 0, 1));
    }

    return defaultScrollTo.diff(startDate, 'month');
  }

  _getDayTime(date: any): number {
    return moment(moment(date).format('YYYY-MM-DD')).valueOf();
  }

  _monthFormat(date: any): string {
    // @ts-ignore
    return moment(date).format(this._d.monthFormat.replace(/y/g, 'Y'));
  }

  _monthFormatYYYYMM(date: any): string {
    // @ts-ignore
    return moment(date).format('YYYY-MM');
  }

  trackByIndex(index: number, momentDate: CalendarMonth): number {
    return momentDate.original ? momentDate.original.time : index;
  }

  private getDateToUse() {
    const date = this._d.defaultDate || this._d.defaultScrollTo;
    return date ? moment(date).toDate() : this._d.defaultFrom;
  }
}
