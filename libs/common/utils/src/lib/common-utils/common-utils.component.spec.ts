import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonUtilsComponent } from './common-utils.component';

describe('CommonUtilsComponent', () => {
  let component: CommonUtilsComponent;
  let fixture: ComponentFixture<CommonUtilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonUtilsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
