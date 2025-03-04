import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandViewComponent } from './demand-view.component';

describe('DemandViewComponent', () => {
  let component: DemandViewComponent;
  let fixture: ComponentFixture<DemandViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
