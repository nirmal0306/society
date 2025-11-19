import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentAboutComponent } from './resident-about.component';

describe('ResidentAboutComponent', () => {
  let component: ResidentAboutComponent;
  let fixture: ComponentFixture<ResidentAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
