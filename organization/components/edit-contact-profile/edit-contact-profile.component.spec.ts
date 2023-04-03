import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@auth/services/auth.service';
import { CurrentUserService } from '@core/services/current-user.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SideModalRef } from '@modals/refs';
import { EditContactProfileComponent } from './edit-contact-profile.component';

describe('EditAdminProfileFormComponent', () => {
  let component: EditContactProfileComponent;
  let fixture: ComponentFixture<EditContactProfileComponent>;
  let mockSideModalRef: SideModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [EditContactProfileComponent],
      providers: [
        { provide: SideModalRef, useValue: mockSideModalRef },
        AuthService,
        CurrentUserService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EditContactProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
