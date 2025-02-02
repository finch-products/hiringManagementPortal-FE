import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSiderbarComponent } from './left-siderbar.component';

describe('LeftSiderbarComponent', () => {
  let component: LeftSiderbarComponent;
  let fixture: ComponentFixture<LeftSiderbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSiderbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftSiderbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
