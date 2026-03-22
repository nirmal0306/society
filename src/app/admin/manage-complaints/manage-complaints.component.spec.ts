import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageComplaintsComponent } from './manage-complaints.component';

describe('ManageComplaintsComponent', () => {
  let component: ManageComplaintsComponent;
  let fixture: ComponentFixture<ManageComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
