import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOpenDemandsComponent } from './list-open-demands.component';

describe('ListOpenDemandsComponent', () => {
  let component: ListOpenDemandsComponent;
  let fixture: ComponentFixture<ListOpenDemandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOpenDemandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOpenDemandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
