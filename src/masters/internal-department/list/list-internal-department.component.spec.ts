import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListInternalDepartmentComponent } from './list-internal-department.component';


describe('ListInternalDepartmentComponent', () => {
  let component: ListInternalDepartmentComponent;
  let fixture: ComponentFixture<ListInternalDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInternalDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInternalDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
