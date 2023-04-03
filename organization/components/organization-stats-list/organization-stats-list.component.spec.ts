import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { StatisticService } from '@shared/services';
import { OrganizationStatsListComponent } from './organization-stats-list.component';

describe('OrganizationStatsListComponent', () => {
  let component: OrganizationStatsListComponent;
  let fixture: ComponentFixture<OrganizationStatsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OrganizationStatsListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [StatisticService],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationStatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
