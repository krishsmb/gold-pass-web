import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCelebrityComponent } from './search-celebrity.component';

describe('SearchCelebrityComponent', () => {
  let component: SearchCelebrityComponent;
  let fixture: ComponentFixture<SearchCelebrityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCelebrityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCelebrityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
