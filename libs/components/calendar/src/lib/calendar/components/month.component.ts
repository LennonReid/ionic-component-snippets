import {
  Component,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarDay, CalendarMonth, CalendarOriginal, PickMode } from '../calendar.model';
import { defaults, pickModes } from '../config';

export const MONTH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MonthComponent),
  multi: true,
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ion-calendar-month',
  providers: [MONTH_VALUE_ACCESSOR],
  styleUrls: ['./month.component.scss'],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.component-mode]': 'componentMode',
  },
  template: `
    <div [class]="color">
      <ng-template [ngIf]="!_isRange" [ngIfElse]="rangeBox">
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month.days || []">
            <div class="days">
              <ng-container *ngIf="day">
                <button
                  type="button"
                  [class]="'days-btn ' + day.cssClass"
                  [class.today]="day.isToday"
                  (click)="onSelected(day)"
                  [class.marked]="day.marked"
                  [class.last-month-day]="day.isLastMonth"
                  [class.next-month-day]="day.isNextMonth"
                  [class.on-selected]="isSelected(day.time)"
                  [disabled]="day.disable"
                  [attr.aria-label]="getDayLabel(day) | date: DAY_DATE_FORMAT"
                >
                  <p>{{ day.title }}</p>
                  <small *ngIf="day.subTitle">{{ day?.subTitle }}</small>
                </button>
              </ng-container>
            </div>
          </ng-template>
        </div>
      </ng-template>

      <ng-template #rangeBox>
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month.days || []">
            <div
              class="days"
              [class.startSelection]="isStartSelection(day)"
              [class.endSelection]="isEndSelection(day)"
              [class.is-first-wrap]="day?.isFirst"
              [class.is-last-wrap]="day?.isLast"
              [class.between]="isBetween(day)"
            >
              <ng-container *ngIf="day">
                <button
                  type="button"
                  [class]="'days-btn ' + day.cssClass"
                  [class.today]="day.isToday"
                  (click)="onSelected(day)"
                  [class.marked]="day.marked"
                  [class.last-month-day]="day.isLastMonth"
                  [class.next-month-day]="day.isNextMonth"
                  [class.is-first]="day.isFirst"
                  [class.is-last]="day.isLast"
                  [class.on-selected]="isSelected(day.time)"
                  [disabled]="day.disable"
                >
                  <p>{{ day.title }}</p>
                  <small *ngIf="day.subTitle">{{ day?.subTitle }}</small>
                </button>
              </ng-container>
            </div>
          </ng-template>
        </div>
      </ng-template>
    </div>
  `,
})
export class MonthComponent implements ControlValueAccessor, AfterViewInit {
  @Input() componentMode = false;
  @Input()
  public month!: CalendarMonth;
  @Input()
  public pickMode!: PickMode | string | undefined;
  @Input()
  public isSaveHistory!: boolean;
  @Input()
  public id!: any;
  @Input()
  public readonly = false;
  @Input()
  public color?: string = defaults.COLOR;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public change: EventEmitter<CalendarDay[]> = new EventEmitter();
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public select: EventEmitter<CalendarDay> = new EventEmitter();
  @Output()
  public selectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output()
  public selectEnd: EventEmitter<CalendarDay> = new EventEmitter();

  public _date: Array<CalendarDay | any> = [];
  _isInit = false;
  public _onChanged!: Function;
  public _onTouched!: Function;

  readonly DAY_DATE_FORMAT = 'MMMM dd, yyyy';

  get _isRange(): boolean {
    return this.pickMode === pickModes.RANGE;
  }

  constructor(public ref: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this._isInit = true;
  }

  get value() {
    return this._date;
  }

  writeValue(obj: any): void {
    if (Array.isArray(obj)) {
      this._date = obj;
    }
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  trackByTime(item: CalendarOriginal) {
    return item ? item.time : 0;
  }

  isEndSelection(day: CalendarDay): boolean {
    if (!day) return false;
    if (this.pickMode !== pickModes.RANGE || !this._isInit || !this._date[1]) {
      return false;
    }

    return this._date[1].time === day.time;
  }

  getDayLabel(day: CalendarDay) {
    return new Date(day.time);
  }

  isBetween(day: CalendarDay): boolean {
    if (!day) return false;

    if (this.pickMode !== pickModes.RANGE || !this._isInit) {
      return false;
    }

    if (!this._date[0] || !this._date[1]) {
      return false;
    }

    const start = this._date[0].time;
    const end = this._date[1].time;

    return day.time < end && day.time > start;
  }

  isStartSelection(day: CalendarDay): boolean {
    if (!day) return false;
    if (this.pickMode !== pickModes.RANGE || !this._isInit || !this._date[0]) {
      return false;
    }

    return this._date[0].time === day.time && this._date[1] !== null;
  }

  isSelected(time: number): boolean {
    if (Array.isArray(this._date)) {
      if (this.pickMode !== pickModes.MULTI) {
        if (this._date[0]) {
          return time === this._date[0].time;
        }

        if (this._date[1]) {
          return time === this._date[1].time;
        }
      } else {
        return this._date.findIndex((e) => e && e.time === time) !== -1;
      }
    } else {
      return false;
    }

    return false;
  }

  onSelected(item: CalendarDay): void {
    if (this.readonly) return;
    item.selected = true;
    this.select.emit(item);
    if (this.pickMode === pickModes.SINGLE) {
      this._date[0] = item;
      this.change.emit(this._date as CalendarDay[]);
      return;
    }

    if (this.pickMode === pickModes.RANGE) {
      if (!this._date[0]) {
        this._date[0] = item;
        this.selectStart.emit(item);
      } else if (!this._date[1]) {
        if (this._date[0].time < item.time) {
          this._date[1] = item;
          this.selectEnd.emit(item);
        } else {
          this._date[1] = this._date[0];
          this.selectEnd.emit(this._date[0]);
          this._date[0] = item;
          this.selectStart.emit(item);
        }
      } else if (this._date[0].time > item.time) {
        this._date[0] = item;
        this.selectStart.emit(item);
      } else if (this._date[1].time < item.time) {
        this._date[1] = item;
        this.selectEnd.emit(item);
      } else {
        this._date[0] = item;
        this.selectStart.emit(item);
        this._date[1] = undefined;
      }

      this.change.emit(this._date as CalendarDay[]);
      return;
    }

    if (this.pickMode === pickModes.MULTI) {
      const index = this._date.findIndex((e) => e !== null && e.time === item.time);

      if (index === -1) {
        this._date.push(item);
      } else {
        this._date.splice(index, 1);
      }
      this.change.emit((this._date as CalendarDay[]).filter((e) => e !== null));
    }
  }
}
