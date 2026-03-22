import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNoticeResidentComponent } from './list-notice-resident.component';

describe('ListNoticeResidentComponent', () => {
  let component: ListNoticeResidentComponent;
  let fixture: ComponentFixture<ListNoticeResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListNoticeResidentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListNoticeResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
