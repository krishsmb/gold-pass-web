import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCommonComponent } from './user-common.component';

describe('UserCommonComponent', () => {
  let component: UserCommonComponent;
  let fixture: ComponentFixture<UserCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
