import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSecuritiesComponent } from './list-securities.component';

describe('ListSecuritiesComponent', () => {
  let component: ListSecuritiesComponent;
  let fixture: ComponentFixture<ListSecuritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSecuritiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSecuritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
