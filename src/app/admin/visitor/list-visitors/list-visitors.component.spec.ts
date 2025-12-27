import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVisitorsComponent } from './list-visitors.component';

describe('ListVisitorsComponent', () => {
  let component: ListVisitorsComponent;
  let fixture: ComponentFixture<ListVisitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListVisitorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListVisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
