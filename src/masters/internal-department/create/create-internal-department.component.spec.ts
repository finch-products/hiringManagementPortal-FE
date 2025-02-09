import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInternalDepartmentComponent } from './create-internal-department.component';

describe('CreateInternalDepartmentComponent', () => {
  let component: CreateInternalDepartmentComponent;
  let fixture: ComponentFixture<CreateInternalDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInternalDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInternalDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
