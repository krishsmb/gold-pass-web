import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporeteLoginComponent } from './corporete-login.component';

describe('CorporeteLoginComponent', () => {
  let component: CorporeteLoginComponent;
  let fixture: ComponentFixture<CorporeteLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporeteLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporeteLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
