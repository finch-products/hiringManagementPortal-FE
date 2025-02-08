import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardsComponent } from './rate-cards.component';

describe('RateCardsComponent', () => {
  let component: RateCardsComponent;
  let fixture: ComponentFixture<RateCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
