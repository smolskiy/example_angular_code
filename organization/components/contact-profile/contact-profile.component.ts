import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from '@shared/models';
import { TranslateService } from '@ngx-translate/core';
import { SideModalService } from '@modals/services/side-modal.service';
import { BreadcrumbService } from '@shared/services/breadcrumb.service';
import { UserService } from '@shared/services/user.service';
import { EditContactProfileComponent } from '../edit-contact-profile/edit-contact-profile.component';

@Component({
  selector: 'tsp-contact-profile',
  templateUrl: './contact-profile.component.html',
  styleUrls: ['./contact-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactProfileComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  private _adminProfile: IUser;

  public get adminProfile(): IUser {
    return this._adminProfile;
  }

  public get status2fa(): string {
    return this._adminProfile.isTwoFactorAuthActivated
      ? 'T_BUTTONS.RESET_2FA'
      : 'T_BUTTONS.ENABLE_2FA';
  }

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _sideModal: SideModalService,
    private readonly _translateService: TranslateService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _userService: UserService,
    private readonly _changeDetectionRef: ChangeDetectorRef
  ) {
    this._adminProfile = this._route.snapshot.data['adminProfile'];
  }

  public ngOnInit(): void {
    this._updateBreadcrumb();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public editAdminProfile(): void {
    const sideModalRef = this._sideModal.open(EditContactProfileComponent, {
      title: 'T_MODALS.EDIT_ADMIN_CONTACT',
      data: this._adminProfile,
    });

    sideModalRef
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe((result) => {
        this._adminProfile = result as IUser;
        this._updateBreadcrumb();
        this._changeDetectorRef.detectChanges();
      });
  }

  public disable2FA(): void {
    this._userService
      .disableTwoFactorAuth(this._adminProfile.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._adminProfile.isTwoFactorAuthActivated = false;
        this._changeDetectionRef.detectChanges();
      });
  }

  private _updateBreadcrumb(): void {
    const label = this._translateService.instant(
      `T_ROLES.${this._adminProfile?.role?.toUpperCase()}`
    );
    this._breadcrumbService.changeLastBreadcrumb({ label });
  }
}
