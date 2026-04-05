import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentNavComponent } from './resident-nav.component';

describe('ResidentNavComponent', () => {
  let component: ResidentNavComponent;
  let fixture: ComponentFixture<ResidentNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
