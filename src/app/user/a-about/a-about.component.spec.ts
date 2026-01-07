import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AAboutComponent } from './a-about.component';

describe('AAboutComponent', () => {
  let component: AAboutComponent;
  let fixture: ComponentFixture<AAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
