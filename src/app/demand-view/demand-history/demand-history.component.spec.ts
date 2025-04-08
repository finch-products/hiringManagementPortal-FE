import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandHistoryComponent2 } from './demand-history.component';

describe('DemandHistoryComponent', () => {
  let component: DemandHistoryComponent2;
  let fixture: ComponentFixture<DemandHistoryComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandHistoryComponent2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandHistoryComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
