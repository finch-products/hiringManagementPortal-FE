import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Otherview3Component } from './otherview3.component';

describe('Otherview3Component', () => {
  let component: Otherview3Component;
  let fixture: ComponentFixture<Otherview3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Otherview3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Otherview3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
