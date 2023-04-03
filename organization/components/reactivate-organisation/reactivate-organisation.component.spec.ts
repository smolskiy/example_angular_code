import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SideModalRef } from '@modals/refs';
import { SideModalService } from '@modals/services';
import { Overlay } from '@angular/cdk/overlay';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationService } from '../../../../modules/organization-shared/services/organization.service';
import { ReactivateOrganisationComponent } from './reactivate-organisation.component';

describe('ReactivateOrganisationComponent', () => {
  let component: ReactivateOrganisationComponent;
  let fixture: ComponentFixture<ReactivateOrganisationComponent>;
  let mockSideModalRef: SideModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NgSelectModule,
      ],
      declarations: [ReactivateOrganisationComponent],
      providers: [
        { provide: SideModalRef, useValue: mockSideModalRef },
        OrganizationService,
        SideModalService,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactivateOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
