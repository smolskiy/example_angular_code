import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RoleType } from '@constants';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SideModalRef } from '@modals/refs';
import { UserService } from '@shared/services';
import { IUser } from '@shared/models';

enum FormControl {
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  PhoneNumber = 'phoneNumber',
  Role = 'role',
}

@Component({
  selector: 'tsp-edit-contact-profile',
  templateUrl: './edit-contact-profile.component.html',
  styleUrls: ['./edit-contact-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditContactProfileComponent implements OnInit, OnDestroy {
  private _adminEditForm!: UntypedFormGroup;
  private readonly _initialFormValue!: IUser;
  private readonly _availableRoles = [RoleType.Admin, RoleType.FinancialTeamUser, RoleType.User];
  private readonly _destroy$ = new Subject<void>();
  private _isLoading: boolean = false;

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public get availableRoles(): RoleType[] {
    return this._availableRoles;
  }

  public get FormControl(): typeof FormControl {
    return FormControl;
  }

  public get adminEditForm(): UntypedFormGroup {
    return this._adminEditForm;
  }

  public get initialRoleValue(): string {
    return this._adminEditForm.controls[FormControl.Role].value || '';
  }

  constructor(
    private readonly _formBuilder: UntypedFormBuilder,
    private readonly _sideModalRef: SideModalRef,
    private readonly _userService: UserService,
    private readonly _translateService: TranslateService,
    private readonly _changeDetectionRef: ChangeDetectorRef
  ) {
    this._initialFormValue = this._sideModalRef?.data as IUser;
  }

  public ngOnInit(): void {
    this._initForm();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public closeMenu(): void {
    this._sideModalRef.close();
  }

  public saveForm(): void {
    const patchedFormValue: Partial<IUser> = this._getPatchedFormValue();

    if (Object.keys(patchedFormValue).length) {
      this._isLoading = true;
      this._userService
        .update(this._initialFormValue.id, patchedFormValue)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (response: IUser) => {
            this._isLoading = false;
            this._sideModalRef.close(response);
          },
          error: (error: HttpErrorResponse) => {
            this._checkErrors(error);
            this._isLoading = false;
            this._changeDetectionRef.detectChanges();
          },
        });
    } else {
      this._sideModalRef.close();
    }
  }

  public hasControlError(control: FormControl): boolean {
    const { invalid, touched } = this._adminEditForm.controls[control];
    return touched && invalid;
  }

  public getControlError(control: FormControl): string {
    const { errors } = this._adminEditForm.controls[control];
    if (!errors || this._adminEditForm.controls[control].untouched) {
      return '';
    }

    if (errors['required']) {
      return this._translateService.instant('T_FORMS.REQUIRED_FIELD');
    }

    return this._translateService.instant('T_FORMS.INVALID_FIELD', { field: control });
  }

  private _initForm(): void {
    this._adminEditForm = this._formBuilder.group({
      [FormControl.FirstName]: [
        this._initialFormValue?.firstName,
        { validators: Validators.required },
      ],
      [FormControl.LastName]: [
        this._initialFormValue?.lastName,
        { validators: Validators.required },
      ],
      [FormControl.Email]: [
        this._initialFormValue?.email,
        { validators: [Validators.required, Validators.email] },
      ],
      [FormControl.PhoneNumber]: [this._initialFormValue?.phoneNumber],
      [FormControl.Role]: [this._initialFormValue?.role],
    });
  }

  private _checkErrors(error: HttpErrorResponse): void {
    if (error.status === HttpStatusCode.BadRequest) {
      error.error.errors.forEach(({ property }: Record<string, string>) => {
        this._adminEditForm.controls[property].setErrors({
          format: true,
        });
      });
    }
  }

  private _getPatchedFormValue(): Partial<IUser> {
    const patchedFormValue: Partial<IUser> = {};
    const { value: changedFormValue } = this._adminEditForm;

    Object.entries(this._initialFormValue).forEach(([key, value]) => {
      if (changedFormValue[key] !== undefined && changedFormValue[key] !== value) {
        patchedFormValue[key as keyof IUser] = changedFormValue[key] || null;
      }
    });

    return patchedFormValue;
  }
}
