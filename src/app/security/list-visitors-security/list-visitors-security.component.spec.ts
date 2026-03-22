import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVisitorsSecurityComponent } from './list-visitors-security.component';

describe('ListVisitorsSecurityComponent', () => {
  let component: ListVisitorsSecurityComponent;
  let fixture: ComponentFixture<ListVisitorsSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListVisitorsSecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListVisitorsSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
