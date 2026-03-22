import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEventResidentComponent } from './list-event-resident.component';

describe('ListEventResidentComponent', () => {
  let component: ListEventResidentComponent;
  let fixture: ComponentFixture<ListEventResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEventResidentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEventResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
