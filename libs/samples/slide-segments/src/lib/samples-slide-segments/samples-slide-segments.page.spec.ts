import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SamplesSlideSegmentsPage } from './samples-slide-segments.page';

describe('SamplesSlideSegmentsPage', () => {
  let component: SamplesSlideSegmentsPage;
  let fixture: ComponentFixture<SamplesSlideSegmentsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesSlideSegmentsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SamplesSlideSegmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
