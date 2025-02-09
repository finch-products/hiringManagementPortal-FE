import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientManagerComponent } from './list-client-manager.component';

describe('ListClientManagerComponent', () => {
  let component: ListClientManagerComponent;
  let fixture: ComponentFixture<ListClientManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClientManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListClientManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
