import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventIHostComponent } from './event-i-host.component';

describe('EventIHostComponent', () => {
  let component: EventIHostComponent;
  let fixture: ComponentFixture<EventIHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventIHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventIHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
