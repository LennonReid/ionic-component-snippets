import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SamplesSelectSearchPage } from './samples-select-search.page';

describe('SamplesSelectSearchPage', () => {
  let component: SamplesSelectSearchPage;
  let fixture: ComponentFixture<SamplesSelectSearchPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesSelectSearchPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SamplesSelectSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
