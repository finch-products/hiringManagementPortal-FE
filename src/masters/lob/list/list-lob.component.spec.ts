import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLOBComponent } from './list-lob.component';

describe('ListLOBComponent', () => {
  let component: ListLOBComponent;
  let fixture: ComponentFixture<ListLOBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLOBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLOBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
