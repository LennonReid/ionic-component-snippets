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

  /**
   * Adjusts the display order of the week array based on the configured week start day.
   */
  adjustSort(): void {
    // Check the configured week start day
    if (this._weekStart === 1) {
      // Week starts on Monday
      // Rotate the week array by one day, putting Sunday at the end
      const firstDay = this._weekArray.shift();
      if (firstDay) {
        this._weekArray.push(firstDay);
      }
      this._displayWeekArray = [...this._weekArray];
    } else if (this._weekStart === 0) {
      // Week starts on Sunday
      // Use the original week array as-is
      this._displayWeekArray = [...this._weekArray];
    } else {
      // Unsupported week start day, use the original week array
      this._displayWeekArray = [...this._weekArray];
    }
  }
}
