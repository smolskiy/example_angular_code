import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SideModalRef } from '@modals/refs';
import { SideModalService } from '@modals/services';
import { IError } from '@shared/models';
import { OrganizationService } from '../../../../modules/organization-shared/services/organization.service';
import { IDetailedOrganization } from '../../../../modules/organization-shared/models/organization.model';

enum FormControl {
  Name = 'name',
  Code = 'code',
  Country = 'country',
  NickName = 'nickName',
  Address = 'address',

  BackupContactFirstName = 'backupContactFirstName',
  BackupContactLastName = 'backupContactLastName',
  BackupContactEmail = 'backupContactEmail',
  BackupContactPhone = 'backupContactPhone',

  PrimaryAdmin = 'primaryAdmin',
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  PhoneNumber = 'phoneNumber',
}

@Component({
  selector: 'tsp-reactivate-organisation',
  templateUrl: './reactivate-organisation.component.html',
  styleUrls: ['./reactivate-organisation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactivateOrganisationComponent implements OnInit, OnDestroy {
  private _reactivateOrganisation!: UntypedFormGroup;
  private readonly _initialFormValue!: IDetailedOrganization;
  private readonly _destroy$ = new Subject<void>();
  private _isLoading: boolean = false;

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public get FormControl(): typeof FormControl {
    return FormControl;
  }

  public get reactivateOrganisation(): UntypedFormGroup {
    return this._reactivateOrganisation;
  }

  public get name(): string {
    return <string>this._initialFormValue?.name;
  }

  public get code(): string {
    return <string>this._initialFormValue?.code;
  }

  constructor(
    private readonly _formBuilder: UntypedFormBuilder,
    private readonly _sideModalRef: SideModalRef,
    private readonly _organisationService: OrganizationService,
    private readonly _translateService: TranslateService,
    private readonly _changeDetectionRef: ChangeDetectorRef,
    private readonly _sideModal: SideModalService
  ) {
    this._initialFormValue = this._sideModalRef?.data as IDetailedOrganization;
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
    this._isLoading = true;
    this._organisationService
      .reactiveById(this._initialFormValue.id, this.reactivateOrganisation.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response: IDetailedOrganization) => {
          this._isLoading = false;
          this._sideModalRef.close(response);
        },
        error: (error: HttpErrorResponse) => {
          this._checkErrors(error);
          this._isLoading = false;
          this._changeDetectionRef.detectChanges();
        },
      });
  }

  public hasControlError(control: FormControl, groupName?: FormControl): boolean {
    const formGroup = (
      groupName ? this._reactivateOrganisation.get(groupName) : this._reactivateOrganisation
    ) as UntypedFormGroup;

    const { invalid, touched } = formGroup.controls[control];
    return touched && invalid;
  }

  public getControlError(control: FormControl, groupName?: FormControl): string {
    const formGroup = (
      groupName ? this._reactivateOrganisation.get(groupName) : this._reactivateOrganisation
    ) as UntypedFormGroup;

    const { errors } = formGroup.controls[control];

    if (!errors || formGroup.controls[control].untouched) {
      return '';
    }

    if (errors['required']) {
      return this._translateService.instant('T_FORMS.REQUIRED_FIELD');
    }

    return this._translateService.instant('T_FORMS.INVALID_FIELD', { field: control });
  }

  private _initForm(): void {
    this._reactivateOrganisation = this._formBuilder.group({
      [FormControl.NickName]: [this._initialFormValue?.nickName],
      [FormControl.Country]: [this._initialFormValue?.country],
      [FormControl.Address]: [
        this._initialFormValue?.address || '',
        { validators: [Validators.required] },
      ],
      [FormControl.BackupContactEmail]: [
        this._initialFormValue?.backupUser?.email,
        { validators: [Validators.required, Validators.email] },
      ],
      [FormControl.BackupContactFirstName]: [
        this._initialFormValue?.backupUser?.firstName,
        { validators: [Validators.required] },
      ],
      [FormControl.BackupContactLastName]: [
        this._initialFormValue?.backupUser?.lastName,
        { validators: [Validators.required] },
      ],
      [FormControl.BackupContactPhone]: [this._initialFormValue?.backupUser?.phoneNumber],
      [FormControl.PrimaryAdmin]: this._formBuilder.group({
        [FormControl.Email]: [
          this._initialFormValue?.users[0]?.email,
          { validators: [Validators.required, Validators.email] },
        ],
        [FormControl.FirstName]: [
          this._initialFormValue?.users[0]?.firstName,
          { validators: [Validators.required] },
        ],
        [FormControl.LastName]: [
          this._initialFormValue?.users[0]?.lastName,
          { validators: [Validators.required] },
        ],
        [FormControl.PhoneNumber]: [this._initialFormValue?.users[0]?.phoneNumber],
      }),
    });
  }

  private _checkErrors(error: HttpErrorResponse): void {
    if (error.status === HttpStatusCode.BadRequest) {
      error.error.errors.forEach((response: IError) => {
        if (response.children.length) {
          const formGroup = this._reactivateOrganisation.get(response.property) as UntypedFormGroup;
          response.children.forEach((children: IError) =>
            this._writeErrorToControl(children.property, formGroup)
          );
        } else {
          this._writeErrorToControl(response.property);
        }
      });
    }
  }

  private _writeErrorToControl(
    property: string,
    formGroup: UntypedFormGroup = this._reactivateOrganisation
  ): void {
    formGroup.controls[property].setErrors({
      format: true,
    });
  }
}
