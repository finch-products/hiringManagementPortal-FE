import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLOBComponent } from './create-lob.component';

describe('CreateLOBComponent', () => {
  let component: CreateLOBComponent;
  let fixture: ComponentFixture<CreateLOBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLOBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLOBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
