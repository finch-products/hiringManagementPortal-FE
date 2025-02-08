import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowsComponent } from './sows.component';

describe('SowsComponent', () => {
  let component: SowsComponent;
  let fixture: ComponentFixture<SowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SowsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
