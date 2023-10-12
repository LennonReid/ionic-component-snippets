import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SamplesCalendarComponent } from './samples-calendar.component';

describe('SamplesCalendarComponent', () => {
  let component: SamplesCalendarComponent;
  let fixture: ComponentFixture<SamplesCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SamplesCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
