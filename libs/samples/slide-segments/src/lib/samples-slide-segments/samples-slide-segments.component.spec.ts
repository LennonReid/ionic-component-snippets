import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SamplesSlideSegmentsComponent } from './samples-slide-segments.component';

describe('SamplesSlideSegmentsComponent', () => {
  let component: SamplesSlideSegmentsComponent;
  let fixture: ComponentFixture<SamplesSlideSegmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesSlideSegmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SamplesSlideSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
