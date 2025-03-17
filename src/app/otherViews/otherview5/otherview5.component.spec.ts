import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Otherview5Component } from './otherview5.component';

describe('Otherview5Component', () => {
  let component: Otherview5Component;
  let fixture: ComponentFixture<Otherview5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Otherview5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Otherview5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
