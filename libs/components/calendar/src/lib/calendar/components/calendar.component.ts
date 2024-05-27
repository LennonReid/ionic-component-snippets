import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  Provider,
} from '@angular/core';

import {
  CalendarComponentMonthChange,
  CalendarComponentOptions,
  CalendarComponentPayloadTypes,
  CalendarComponentTypeProperty,
  CalendarDay,
  CalendarMonth,
  InternalCalendarModalOptions,
} from '../calendar.model';
import { CalendarService } from '../services/calendar.service';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import moment from 'moment';
import { defaults, pickModes } from '../config';
import { isIonIconsV4 } from '../utils/icons';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { CalendarWeekComponent } from './calendar-week.component';
import { MonthComponent } from './month.component';
import { MonthPickerComponent } from './month-picker.component';

export const ION_CAL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarComponent),
  multi: true,
};

interface CompatibleIcons {
  caretDown: string;
  caretUp: string;
  chevronBack: string;
  chevronForward: string;
}

@Component({
  selector: 'ion-calendar',
  providers: [ION_CAL_VALUE_ACCESSOR, CalendarService],
  styleUrls: ['./calendar.component.scss'],
  template: `
    <ion-item>
      <ng-template [ngIf]="_showMonthPicker" [ngIfElse]="title">
        <ion-button
          type="button"
          fill="clear"
          class="switch-btn"
          [attr.aria-label]="
            getDate(monthOpt.original.time) | date : MONTH_DATE_FORMAT
          "
          (click)="switchView()"
        >
          {{ _monthFormat(monthOpt.original.time) }}
          <ion-icon
            class="arrow-dropdown"
            [name]="
              _view === 'days'
                ? _compatibleIcons.caretDown
                : _compatibleIcons.caretUp
            "
          ></ion-icon>
        </ion-button>
      </ng-template>
      <ng-template #title>
        <div
          class="switch-btn"
          [attr.aria-label]="
            getDate(monthOpt.original.time) | date : MONTH_DATE_FORMAT
          "
        >
          {{ _monthFormat(monthOpt.original.time) }}
        </div>
      </ng-template>
      <ng-template [ngIf]="_showToggleButtons">
        <ion-button
          slot="start"
          type="button"
          fill="clear"
          class="back"
          [disabled]="!canBack()"
          (click)="prev()"
        >
          <ion-icon
            slot="icon-only"
            size="small"
            [name]="_compatibleIcons.chevronBack"
          ></ion-icon>
        </ion-button>
        <ion-button
          slot="end"
          type="button"
          fill="clear"
          class="forward"
          [disabled]="!canNext()"
          (click)="next()"
        >
          <ion-icon
            slot="icon-only"
            size="small"
            [name]="_compatibleIcons.chevronForward"
          ></ion-icon>
        </ion-button>
      </ng-template>
    </ion-item>
    <ng-template [ngIf]="_view === 'days'" [ngIfElse]="monthPicker">
      <ion-calendar-week
        color="transparent"
        [weekArray]="_d.weekdays || []"
        [weekStart]="_d.weekStart || 1"
      >
      </ion-calendar-week>

      <ion-calendar-month
        [componentMode]="true"
        [(ngModel)]="_calendarMonthValue"
        [month]="monthOpt"
        [readonly]="readonly"
        (change)="onChanged($event)"
        (swipe)="swipeEvent($event)"
        (select)="select.emit($event)"
        (selectStart)="selectStart.emit($event)"
        (selectEnd)="selectEnd.emit($event)"
        [pickMode]="_d.pickMode"
        [color]="_d.color"
      >
      </ion-calendar-month>
    </ng-template>

    <ng-template #monthPicker>
      <ion-calendar-month-picker
        [color]="_d.color"
        [monthFormat]="_options.monthPickerFormat || []"
        (select)="monthOnSelect($event)"
        [month]="monthOpt"
      >
      </ion-calendar-month-picker>
    </ng-template>
  `,
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    FormsModule,
    CalendarWeekComponent,
    MonthComponent,
    MonthPickerComponent,
  ],
})
export class CalendarComponent implements ControlValueAccessor, OnInit {
  _d!: InternalCalendarModalOptions;
  _options!: CalendarComponentOptions;
  _view: 'month' | 'days' = 'days';
  _calendarMonthValue: CalendarDay[] = [];
  _showToggleButtons = true;
  _compatibleIcons: CompatibleIcons;
  get showToggleButtons(): boolean {
    return this._showToggleButtons;
  }

  set showToggleButtons(value: boolean) {
    this._showToggleButtons = value;
  }

  _showMonthPicker = true;
  get showMonthPicker(): boolean {
    return this._showMonthPicker;
  }

  set showMonthPicker(value: boolean) {
    this._showMonthPicker = value;
  }

  public monthOpt!: CalendarMonth;

  @Input()
  public format: string = defaults.DATE_FORMAT;
  @Input()
  public type: CalendarComponentTypeProperty = 'string';
  @Input()
  public readonly = false;
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public change: EventEmitter<CalendarComponentPayloadTypes> =
    new EventEmitter();
  @Output()
  public monthChange: EventEmitter<CalendarComponentMonthChange> =
    new EventEmitter();
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public select: EventEmitter<CalendarDay> = new EventEmitter();
  @Output()
  public selectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output()
  public selectEnd: EventEmitter<CalendarDay> = new EventEmitter();

  @Input()
  set options(value: CalendarComponentOptions) {
    this._options = value;
    this.initOpt();
    if (this.monthOpt && this.monthOpt.original) {
      this.monthOpt = this.createMonth(this.monthOpt.original.time);
    }
  }

  get options(): CalendarComponentOptions {
    return this._options;
  }

  readonly MONTH_DATE_FORMAT = 'MMMM yyyy';

  constructor(public calSvc: CalendarService) {
    if (isIonIconsV4()) {
      this._compatibleIcons = {
        caretDown: 'md-arrow-dropdown',
        caretUp: 'md-arrow-dropup',
        chevronBack: 'ios-arrow-back',
        chevronForward: 'ios-arrow-forward',
      };
    } else {
      this._compatibleIcons = {
        caretDown: 'caret-down-outline',
        caretUp: 'caret-up-outline',
        chevronBack: 'chevron-back-outline',
        chevronForward: 'chevron-forward-outline',
      };
    }
  }

  ngOnInit(): void {
    this.initOpt();
    this.monthOpt = this.createMonth(new Date().getTime());
  }

  getViewDate() {
    return this._handleType(this.monthOpt.original.time);
  }

  getDate(date: number) {
    return new Date(date);
  }

  setViewDate(value: CalendarComponentPayloadTypes) {
    this.monthOpt = this.createMonth(this._payloadToTimeNumber(value));
  }

  switchView(): void {
    this._view = this._view === 'days' ? 'month' : 'days';
  }

  prev(): void {
    if (this._view === 'days') {
      this.backMonth();
    } else {
      this.prevYear();
    }
  }

  next(): void {
    if (this._view === 'days') {
      this.nextMonth();
    } else {
      this.nextYear();
    }
  }

  prevYear(): void {
    if (moment(this.monthOpt.original.time).year() === 1970) {
      return;
    }
    const backTime = moment(this.monthOpt.original.time)
      .subtract(1, 'year')
      .valueOf();
    this.monthOpt = this.createMonth(backTime);
  }

  nextYear(): void {
    const nextTime = moment(this.monthOpt.original.time)
      .add(1, 'year')
      .valueOf();
    this.monthOpt = this.createMonth(nextTime);
  }

  nextMonth(): void {
    const nextTime = moment(this.monthOpt.original.time)
      .add(1, 'months')
      .valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(nextTime),
    });
    this.monthOpt = this.createMonth(nextTime);
  }

  canNext(): boolean {
    if (!this._d.to || this._view !== 'days') {
      return true;
    }
    return this.monthOpt.original.time < moment(this._d.to).valueOf();
  }

  backMonth(): void {
    const backTime = moment(this.monthOpt.original.time)
      .subtract(1, 'months')
      .valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(backTime),
    });
    this.monthOpt = this.createMonth(backTime);
  }

  canBack(): boolean {
    if (!this._d.from || this._view !== 'days') {
      return true;
    }
    return this.monthOpt.original.time > moment(this._d.from).valueOf();
  }

  monthOnSelect(month: number): void {
    this._view = 'days';
    const newMonth = moment(this.monthOpt.original.time).month(month).valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(newMonth),
    });
    this.monthOpt = this.createMonth(newMonth);
  }

  onChanged($event: CalendarDay[]): void {
    if (this._d.pickMode === pickModes.SINGLE) {
      const date = this._handleType($event[0].time);
      this._onChanged(date);
      this.change.emit(date);
    } else if (this._d.pickMode === pickModes.RANGE) {
      if ($event[0] && $event[1]) {
        const rangeDate = {
          from: this._handleType($event[0].time),
          to: this._handleType($event[1].time),
        };
        this._onChanged(rangeDate);
        this.change.emit(rangeDate);
      }
    } else if (this._d.pickMode === pickModes.MULTI) {
      const dates = [];

      for (let i = 0; i < $event.length; i++) {
        if ($event[i] && $event[i].time) {
          dates.push(this._handleType($event[i].time));
        }
      }

      this._onChanged(dates);
      this.change.emit(dates);
    } else {
      // TOOD: do something
    }
  }

  swipeEvent($event: any): void {
    const isNext = $event.deltaX < 0;
    if (isNext && this.canNext()) {
      this.nextMonth();
    } else if (!isNext && this.canBack()) {
      this.backMonth();
    }
  }

  _onChanged: (date: any) => void = () => {
    // TOOD: do something
  };

  _onTouched: (date: any) => void = () => {
    // TOOD: do something
  };

  _payloadToTimeNumber(value: CalendarComponentPayloadTypes): number {
    let date;
    if (this.type === 'string') {
      date = moment(value, this.format);
    } else {
      date = moment(value);
    }
    return date.valueOf();
  }

  _monthFormat(date: number): string {
    return moment(date)
      .format(this._d.monthFormat?.replace(/y/g, 'Y'))
      .replace(
        moment.locale() === 'en'
          ? moment(date).format('D')
          : moment(date).format('Do'),
        ''
      );
  }

  private initOpt(): void {
    if (this._options && typeof this._options.showToggleButtons === 'boolean') {
      this.showToggleButtons = this._options.showToggleButtons;
    }
    if (this._options && typeof this._options.showMonthPicker === 'boolean') {
      this.showMonthPicker = this._options.showMonthPicker;
      if (this._view !== 'days' && !this.showMonthPicker) {
        this._view = 'days';
      }
    }
    this._d = this.calSvc.safeOpt(this._options || {});
  }

  createMonth(date: number): CalendarMonth {
    return this.calSvc.createMonthsByPeriod(date, 1, this._d)[0];
  }

  _createCalendarDay(value: CalendarComponentPayloadTypes): CalendarDay {
    return this.calSvc.createCalendarDay(
      this._payloadToTimeNumber(value),
      this._d
    );
  }

  _handleType(value: number): CalendarComponentPayloadTypes {
    const date = moment(value);
    if (this.type === 'string') {
      return date.format(this.format);
    } else if (this.type === 'js-date') {
      return date.toDate();
    } else if (this.type === 'moment') {
      return date;
    } else if (this.type === 'time') {
      return date.valueOf();
    } else if (this.type === 'object') {
      return date.toObject();
    }
    return date;
  }

  writeValue(obj: any): void {
    this._writeValue(obj);
    if (obj) {
      if (this._calendarMonthValue[0]) {
        this.monthOpt = this.createMonth(this._calendarMonthValue[0].time);
      } else {
        this.monthOpt = this.createMonth(new Date().getTime());
      }
    }
  }

  registerOnChange(fn: () => void): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  _writeValue(value: any): void {
    if (!value) {
      this._calendarMonthValue = [];
      return;
    }

    if (this._d.pickMode === 'single') {
      this._calendarMonthValue[0] = this._createCalendarDay(value);
    } else if (this._d.pickMode === 'range') {
      if (value.from) {
        this._calendarMonthValue[0] = this._createCalendarDay(value.from);
      }
      if (value.to) {
        this._calendarMonthValue[1] = this._createCalendarDay(value.to);
      }
    } else if (this._d.pickMode === 'multi') {
      if (Array.isArray(value)) {
        this._calendarMonthValue = value.map((e) => {
          return this._createCalendarDay(e);
        });
      } else {
        this._calendarMonthValue = [];
      }
    } else {
      // TODO: do something
    }
  }
}
