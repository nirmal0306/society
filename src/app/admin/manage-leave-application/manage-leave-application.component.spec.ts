import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLeaveApplicationComponent } from './manage-leave-application.component';

describe('ManageLeaveApplicationComponent', () => {
  let component: ManageLeaveApplicationComponent;
  let fixture: ComponentFixture<ManageLeaveApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLeaveApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLeaveApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
