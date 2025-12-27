import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSecurityComponent } from './edit-security.component';

describe('EditSecurityComponent', () => {
  let component: EditSecurityComponent;
  let fixture: ComponentFixture<EditSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
