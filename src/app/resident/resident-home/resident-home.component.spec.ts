import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentHomeComponent } from './resident-home.component';

describe('ResidentHomeComponent', () => {
  let component: ResidentHomeComponent;
  let fixture: ComponentFixture<ResidentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
