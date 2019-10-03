import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHeadersComponent } from './profile-headers.component';

describe('ProfileHeadersComponent', () => {
  let component: ProfileHeadersComponent;
  let fixture: ComponentFixture<ProfileHeadersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileHeadersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
