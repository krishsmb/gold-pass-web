import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTgsComponent } from './all-tgs.component';

describe('AllTgsComponent', () => {
  let component: AllTgsComponent;
  let fixture: ComponentFixture<AllTgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
