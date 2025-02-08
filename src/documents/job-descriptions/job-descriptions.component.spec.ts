import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescriptionsComponent } from './job-descriptions.component';

describe('JobDescriptionsComponent', () => {
  let component: JobDescriptionsComponent;
  let fixture: ComponentFixture<JobDescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDescriptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
