import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarMonth } from '../calendar.model';
import { defaults } from '../config';
import moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'ion-calendar-month-picker',
  styleUrls: ['./month-picker.component.scss'],
  template: `
    <div [class]="'month-picker ' + color">
      @for (item of _monthFormat; track i; let i = $index) {
      <div
        class="month-packer-item"
        [class.this-month]="
          i === _thisMonth.getMonth() &&
          month.original.year === _thisMonth.getFullYear()
        "
      >
        <button
          type="button"
          (click)="_onSelect(i)"
          [attr.aria-label]="getDate(i) | date : MONTH_FORMAT"
        >
          {{ item }}
        </button>
      </div>
      }
    </div>
  `,
  standalone: true,
})
export class MonthPickerComponent {
  @Input()
  public month!: CalendarMonth;
  @Input()
  public color? = defaults.COLOR;
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public select: EventEmitter<number> = new EventEmitter();
  _thisMonth = new Date();
  _monthFormat = moment.monthsShort() || defaults.MONTH_FORMAT;

  MONTH_FORMAT = 'MMMM';

  @Input()
  set monthFormat(value: string[]) {
    if (Array.isArray(value) && value.length === 12) {
      this._monthFormat = value;
    }
  }

  get monthFormat(): string[] {
    return this._monthFormat;
  }

  constructor() {}

  _onSelect(month: number): void {
    this.select.emit(month);
  }

  getDate(month: number) {
    return new Date(this._thisMonth.getFullYear(), month, 1);
  }
}
