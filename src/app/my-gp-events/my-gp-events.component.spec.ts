import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGpEventsComponent } from './my-gp-events.component';

describe('MyGpEventsComponent', () => {
  let component: MyGpEventsComponent;
  let fixture: ComponentFixture<MyGpEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGpEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGpEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
