import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayMaintenanceComponent } from './pay-maintenance.component';

describe('PayMaintenanceComponent', () => {
  let component: PayMaintenanceComponent;
  let fixture: ComponentFixture<PayMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
