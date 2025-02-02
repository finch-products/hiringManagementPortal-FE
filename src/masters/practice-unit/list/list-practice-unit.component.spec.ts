import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPracticeUnitComponent } from './list-practice-unit.component';

describe('ListPracticeUnitComponent', () => {
  let component: ListPracticeUnitComponent;
  let fixture: ComponentFixture<ListPracticeUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPracticeUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPracticeUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
