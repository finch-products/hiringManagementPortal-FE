import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTrackingComponent } from './candidate-tracking.component';

describe('CandidateTrackingComponent', () => {
  let component: CandidateTrackingComponent;
  let fixture: ComponentFixture<CandidateTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
