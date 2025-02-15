import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Otherview1Component } from './otherview1.component';

describe('Otherview1Component', () => {
  let component: Otherview1Component;
  let fixture: ComponentFixture<Otherview1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Otherview1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Otherview1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
