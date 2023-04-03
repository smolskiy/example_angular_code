import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmModalService, SideModalService } from '@modals/services';
import { Overlay } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { OrganizationInfoPageComponent } from './organization-info-page.component';
import { OrganizationService } from '../../../../modules/organization-shared/services/organization.service';

describe('OrganizationInfoComponent', () => {
  let component: OrganizationInfoPageComponent;
  let fixture: ComponentFixture<OrganizationInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [OrganizationInfoPageComponent],
      providers: [OrganizationService, ConfirmModalService, Overlay, SideModalService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
