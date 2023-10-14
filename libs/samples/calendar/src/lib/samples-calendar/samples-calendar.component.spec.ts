import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SamplesCalendarPage } from './samples-calendar.component';

describe('SamplesCalendarPage', () => {
  let component: SamplesCalendarPage;
  let fixture: ComponentFixture<SamplesCalendarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesCalendarPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SamplesCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
