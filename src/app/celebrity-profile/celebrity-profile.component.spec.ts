import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrityProfileComponent } from './celebrity-profile.component';

describe('CelebrityProfileComponent', () => {
  let component: CelebrityProfileComponent;
  let fixture: ComponentFixture<CelebrityProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CelebrityProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CelebrityProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
