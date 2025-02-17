import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Otherview2Component } from './otherview2.component';

describe('Otherview2Component', () => {
  let component: Otherview2Component;
  let fixture: ComponentFixture<Otherview2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Otherview2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Otherview2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
