import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ITableColumnData } from '@shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, mergeMap, Subject, takeUntil, tap } from 'rxjs';
import { OrgActionsKey, OrganizationStatus } from '@constants';
import { ConfirmModalService, SideModalService } from '@modals/services';
import { ORGANIZATION_INFO_TABLE_COLUMNS } from '../../utils';
import { RouteData } from '../../models';
import { ReactivateOrganisationComponent } from '../../components/reactivate-organisation/reactivate-organisation.component';
import { OrganizationService } from '../../../../modules/organization-shared/services/organization.service';
import {
  IDetailedOrganization,
  IUserInfo,
  UserInfoKeys,
} from '../../../../modules/organization-shared/models/organization.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'tsp-organization-info-page',
  templateUrl: './organization-info-page.component.html',
  styleUrls: ['./organization-info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationInfoPageComponent implements OnInit, OnDestroy {
  private readonly _tableColumns = ORGANIZATION_INFO_TABLE_COLUMNS;
  private _isActionKeyLoading = false;
  private _isDeactivateLoading = false;
  private readonly _destroy$ = new Subject<void>();
  private _organization: IDetailedOrganization;
  private _isAvailableScheduleDeleteKey = false;
  private readonly _pendingDeleteKey = environment.scheduleDeleteAvailableDAYS;

  private get _statusScheduleDeleteKey(): boolean {
    if (!this._organization?.deactivateAt) {
      return false;
    }
    const deactivateAt = new Date(`${this._organization.deactivateAt}`);
    return deactivateAt.setDate(deactivateAt.getDate() + this._pendingDeleteKey) < +new Date();
  }

  public get isDeactivateLoading(): boolean {
    return this._isDeactivateLoading;
  }

  public get isActionKeyLoading(): boolean {
    return this._isActionKeyLoading;
  }

  public get organization(): IDetailedOrganization {
    return this._organization;
  }

  public get tableColumns(): ITableColumnData[] {
    return this._tableColumns;
  }

  public get isDeactivated(): boolean {
    return this._organization.status === OrganizationStatus.Deleted;
  }

  public get scheduleActionKey(): OrgActionsKey {
    return OrgActionsKey.ScheduleKeyDeletion;
  }

  public get cancelScheduleActionKey(): OrgActionsKey {
    return OrgActionsKey.CancelScheduleDelete;
  }

  public get isAvailableScheduleDeleteKey(): boolean {
    return this._isAvailableScheduleDeleteKey;
  }

  public get isStartScheduleKeyDeleteAt(): boolean {
    return !!this._organization?.startScheduleKeyDeleteAt;
  }

  public get Cell(): typeof UserInfoKeys {
    return UserInfoKeys;
  }

  constructor(
    private readonly _organisationService: OrganizationService,
    private readonly _route: ActivatedRoute,
    private readonly _confirmModal: ConfirmModalService,
    private readonly _router: Router,
    private readonly _sideModal: SideModalService,
    private readonly _changeDetectorRef: ChangeDetectorRef
  ) {
    this._organization = this._route.snapshot.data[RouteData.Organization];
  }

  public ngOnInit(): void {
    this._isAvailableScheduleDeleteKey = this._statusScheduleDeleteKey;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public navigateToAdminPage(user: IUserInfo): void {
    this._router.navigate([this._router.url, 'contact', user.id]);
  }

  public reactivateOrganisation(): void {
    const modalRef = this._sideModal.open(ReactivateOrganisationComponent, {
      title: 'T_MODALS.REACTIVATE_ORGANIZATION',
      data: this._organization,
    });

    modalRef
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe((response): void => {
        this._organization = response as IDetailedOrganization;
      });
  }

  public actionOrgKey(action: OrgActionsKey): void {
    const modalRef = this._confirmModal.open({
      title: `T_ORGANIZATION.KMS.${action.toUpperCase()}`,
      data: {
        cancelButton: 'T_BUTTONS.NO_CANCEL',
        confirmButton: 'T_BUTTONS.YES_DELETE',
      },
    });

    modalRef
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
        tap(() => {
          this._isActionKeyLoading = true;
          this._changeDetectorRef.detectChanges();
        }),
        mergeMap(() => this._organisationService[action](this.organization.id)),
        finalize(() => {
          this._isActionKeyLoading = false;
          this._changeDetectorRef.detectChanges();
        })
      )
      .subscribe(() => {
        if (action === OrgActionsKey.ScheduleKeyDeletion) {
          this._organization.startScheduleKeyDeleteAt = `${new Date()}`;
        } else {
          this._organization.startScheduleKeyDeleteAt = null;
        }
      });
  }

  public deleteOrganization(): void {
    const modalRef = this._confirmModal.open({
      title: 'T_MODALS.DELETE_ORGANIZATION',
      data: {
        cancelButton: 'T_BUTTONS.NO_CANCEL',
        confirmButton: 'T_BUTTONS.YES_DELETE',
      },
    });

    modalRef
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
        tap(() => {
          this._isDeactivateLoading = true;
          this._changeDetectorRef.detectChanges();
        }),
        mergeMap(() => this._organisationService.deleteById(this.organization.id))
      )
      .subscribe(() => {
        this._isDeactivateLoading = false;
        this._organization.status = OrganizationStatus.Deleted;
        this._changeDetectorRef.detectChanges();
      });
  }
}
