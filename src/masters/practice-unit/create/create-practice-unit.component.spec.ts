import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePracticeUnitComponent } from './create-practice-unit.component';

describe('CreatePracticeUnitComponent', () => {
  let component: CreatePracticeUnitComponent;
  let fixture: ComponentFixture<CreatePracticeUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePracticeUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePracticeUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
