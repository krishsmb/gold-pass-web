import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGpEventsComponent } from './all-gp-events.component';

describe('AllGpEventsComponent', () => {
  let component: AllGpEventsComponent;
  let fixture: ComponentFixture<AllGpEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllGpEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllGpEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
