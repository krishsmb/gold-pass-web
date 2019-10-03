import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldpassStatsComponent } from './goldpass-stats.component';

describe('GoldpassStatsComponent', () => {
  let component: GoldpassStatsComponent;
  let fixture: ComponentFixture<GoldpassStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldpassStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldpassStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
