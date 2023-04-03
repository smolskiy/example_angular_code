import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { OrganizationListPageComponent } from './organization-list-page.component';
import { OrganizationService } from '../../../../modules/organization-shared/services/organization.service';

describe('OrganizationListComponent', () => {
  let component: OrganizationListPageComponent;
  let fixture: ComponentFixture<OrganizationListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [OrganizationListPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [OrganizationService],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
