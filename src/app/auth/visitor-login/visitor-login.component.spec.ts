import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorLoginComponent } from './visitor-login.component';

describe('VisitorLoginComponent', () => {
  let component: VisitorLoginComponent;
  let fixture: ComponentFixture<VisitorLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
