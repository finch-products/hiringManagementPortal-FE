import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientManagerComponent } from './create-client-manager.component';

describe('CreateClientManagerComponent', () => {
  let component: CreateClientManagerComponent;
  let fixture: ComponentFixture<CreateClientManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClientManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClientManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
