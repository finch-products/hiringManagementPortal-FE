import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSearchCandidatesComponent } from './advance-search-candidates.component';

describe('AdvanceSearchCandidatesComponent', () => {
  let component: AdvanceSearchCandidatesComponent;
  let fixture: ComponentFixture<AdvanceSearchCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceSearchCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceSearchCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
