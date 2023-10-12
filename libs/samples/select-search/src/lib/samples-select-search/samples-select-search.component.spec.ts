import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SamplesSelectSearchComponent } from './samples-select-search.component';

describe('SamplesSelectSearchComponent', () => {
  let component: SamplesSelectSearchComponent;
  let fixture: ComponentFixture<SamplesSelectSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesSelectSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SamplesSelectSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
