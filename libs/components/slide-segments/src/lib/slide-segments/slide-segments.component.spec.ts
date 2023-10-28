import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlideSegmentsComponent } from './slide-segments.component';

describe('SlideSegmentsComponent', () => {
  let component: SlideSegmentsComponent;
  let fixture: ComponentFixture<SlideSegmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideSegmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
