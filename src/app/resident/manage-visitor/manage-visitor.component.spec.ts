import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVisitorComponent } from './manage-visitor.component';

describe('ManageVisitorComponent', () => {
  let component: ManageVisitorComponent;
  let fixture: ComponentFixture<ManageVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageVisitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
