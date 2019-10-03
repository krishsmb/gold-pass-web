import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftNaveComponent } from './left-nave.component';

describe('LeftNaveComponent', () => {
  let component: LeftNaveComponent;
  let fixture: ComponentFixture<LeftNaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftNaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftNaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
