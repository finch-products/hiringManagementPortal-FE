import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOpenDemandComponent } from './create-open-demands.component';

describe('CreateOpenDemandComponent', () => {
  let component: CreateOpenDemandComponent;
  let fixture: ComponentFixture<CreateOpenDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOpenDemandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOpenDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
