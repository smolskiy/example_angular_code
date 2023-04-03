import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SideModalService } from '@modals/services';
import { Overlay } from '@angular/cdk/overlay';
import { NgxMaskModule } from 'ngx-mask';
import { ContactProfileComponent } from './contact-profile.component';

describe('AdminProfileComponent', () => {
  let component: ContactProfileComponent;
  let fixture: ComponentFixture<ContactProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        NgxMaskModule.forRoot(),
      ],
      declarations: [ContactProfileComponent],
      providers: [SideModalService, Overlay],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
