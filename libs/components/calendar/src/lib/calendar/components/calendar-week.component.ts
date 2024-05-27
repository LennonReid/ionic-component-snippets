import { Component, Input } from '@angular/core';
import { defaults } from '../config';
import { IonToolbar } from '@ionic/angular/standalone';
import moment from 'moment';
@Component({
  imports: [IonToolbar],
  selector: 'ion-calendar-week',
  styleUrls: ['./calendar-week.component.scss'],
  template: `
    <ion-toolbar [class]="'week-toolbar ' + color" no-border-top>
      <ul [class]="'week-title ' + color">
        @for (w of _displayWeekArray; track $index) {
        <li>{{ w }}</li>
        }
      </ul>
    </ion-toolbar>
  `,
  standalone: true,
})
export class CalendarWeekComponent {
  _weekArray: string[] = moment.weekdaysShort() || defaults.WEEKS_FORMAT;
  _displayWeekArray: string[] = this._weekArray;
  _weekStart = 0;
  @Input()
  public color: string = defaults.COLOR;

  constructor() {}

  @Input()
  set weekArray(value: string[]) {
    if (value && value.length === 7) {
      this._weekArray = [...value];
      this.adjustSort();
    }
  }

  @Input()
  set weekStart(value: number) {
    if (value === 0 || value === 1) {
      this._weekStart = value;
      this.adjustSort();
    }
  }

  adjustSort(): void {
    if (this._weekStart === 1) {
      const cacheWeekArray = [...this._weekArray];
      // @ts-ignore
      cacheWeekArray.push(cacheWeekArray.shift());
      this._displayWeekArray = [...cacheWeekArray];
    } else if (this._weekStart === 0) {
      this._displayWeekArray = [...this._weekArray];
    }
  }
}
