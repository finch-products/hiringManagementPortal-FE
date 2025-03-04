import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Otherview4Component } from './otherview4.component';

describe('Otherview4Component', () => {
  let component: Otherview4Component;
  let fixture: ComponentFixture<Otherview4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Otherview4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Otherview4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
