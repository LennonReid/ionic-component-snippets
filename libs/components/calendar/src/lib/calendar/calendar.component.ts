import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'component-snippets-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {}
