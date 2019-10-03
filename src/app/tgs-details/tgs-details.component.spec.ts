import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TgsDetailsComponent } from './tgs-details.component';

describe('TgsDetailsComponent', () => {
  let component: TgsDetailsComponent;
  let fixture: ComponentFixture<TgsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TgsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TgsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
