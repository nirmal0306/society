import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAboutComponent } from './security-about.component';

describe('SecurityAboutComponent', () => {
  let component: SecurityAboutComponent;
  let fixture: ComponentFixture<SecurityAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
