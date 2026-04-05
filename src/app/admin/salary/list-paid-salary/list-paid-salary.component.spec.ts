import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaidSalaryComponent } from './list-paid-salary.component';

describe('ListPaidSalaryComponent', () => {
  let component: ListPaidSalaryComponent;
  let fixture: ComponentFixture<ListPaidSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPaidSalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPaidSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
