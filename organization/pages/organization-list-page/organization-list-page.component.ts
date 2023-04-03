import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { finalize, mergeMap, Subject, takeUntil, tap } from 'rxjs';
import { ISelectItem, ITableColumnData } from '@shared/models';
import { HttpParams } from '@angular/common/http';
import { DATEPICKER_CONFIG, QueryParams, StorageItem } from '@constants';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { QueryParamService } from '@shared/services/query-param.service';
import { SETTINGS_COLUMNS_TABLE, STATUS_OPTIONS, TYPE_OF_CONTRACT_OPTIONS } from '../../utils';
import { Nullable } from '../../../../models';
import { OrganizationService } from '../../../../modules/organization-shared/services/organization.service';
import {
  IOrganization,
  IOrganizationResponse,
  OrganizationKeys,
} from '../../../../modules/organization-shared/models/organization.model';
import { STORAGE_KEY } from '../../../../constants/tokens';

@Component({
  selector: 'tsp-organization-list-page',
  templateUrl: './organization-list-page.component.html',
  styleUrls: ['./organization-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    QueryParamService,
    {
      provide: STORAGE_KEY,
      useValue: StorageItem.OrganizationListParams,
    },
  ],
})
export class OrganizationListPageComponent implements OnInit, OnDestroy {
  private readonly _columnTable: ITableColumnData[] = SETTINGS_COLUMNS_TABLE;
  private readonly _cancelGettingTypeahead$ = new Subject<void>();
  private _typeaheadData: string[] = [];
  private readonly _bsConfig = DATEPICKER_CONFIG;
  private readonly _destroy$ = new Subject<void>();
  private _organizations: Nullable<IOrganizationResponse> = null;
  private _isLoading: boolean = false;
  private readonly _cancel$ = new Subject<void>();
  public itemsPerPage: Nullable<number> = null;

  public get bsConfig(): Partial<BsDaterangepickerConfig> {
    return this._bsConfig;
  }

  public get typeaheadData(): string[] {
    return this._typeaheadData;
  }

  public get statusOptions(): ISelectItem[] {
    return STATUS_OPTIONS;
  }

  public get typeOfContractOptions(): ISelectItem[] {
    return TYPE_OF_CONTRACT_OPTIONS;
  }

  public get isNotFound(): boolean {
    return !this._organizations?.count && !this._isLoading;
  }

  public get QueryParams(): typeof QueryParams {
    return QueryParams;
  }

  public get Cell(): typeof OrganizationKeys {
    return OrganizationKeys;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public get columnTable(): ITableColumnData[] {
    return this._columnTable;
  }

  public get organizations(): Nullable<IOrganizationResponse> {
    return this._organizations;
  }

  constructor(
    private readonly _organizationService: OrganizationService,
    private readonly _queryParamService: QueryParamService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _router: Router
  ) {}

  public ngOnInit(): void {
    this._getDataByQueryParams();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._cancel$.complete();
    this._cancelGettingTypeahead$.complete();
    this._destroy$.complete();
  }

  public navigateToOrganization(organization: IOrganization): void {
    this._router.navigate([this._router.url, organization.id]);
  }

  public dateChange([startDate, endDate]: (Date | undefined)[]): void {
    if (!startDate || !endDate) {
      return;
    }

    this._queryParamService.set({
      [QueryParams.ContractStartDate]: startDate.toISOString(),
      [QueryParams.ContractEndDate]: endDate.toISOString(),
    });
  }

  public getTypeaheadData(search: string): void {
    this._cancelGettingTypeahead$.next();
    this._organizationService
      .getList(new HttpParams({ fromObject: { search } }))
      .pipe(
        takeUntil(this._destroy$),
        takeUntil(this._cancelGettingTypeahead$),
        finalize(() => {
          this._changeDetectorRef.markForCheck();
        })
      )
      .subscribe((organizations: IOrganizationResponse) => {
        this._typeaheadData = organizations.data.map((org: IOrganization) => org.name);
      });
  }

  public search(search: string): void {
    this._queryParamService.set({ search, page: 1 });
  }

  public pageChange(page: number): void {
    this._queryParamService.set({ page });
  }

  public changeLimit(limit: number): void {
    this._queryParamService.set({ limit, page: 1 });
  }

  public filterQueryChange(param: QueryParams, value: string): void {
    this._queryParamService.set({ [param]: value });
  }

  private _setItemsPerPage(params: HttpParams): void {
    this.itemsPerPage = Number(params.get(QueryParams.Limit)) || this.itemsPerPage;
  }

  private _getDataByQueryParams(): void {
    this._queryParamService.paramsChange
      .pipe(
        takeUntil(this._destroy$),
        tap((params: HttpParams) => {
          this._setItemsPerPage(params);
        }),
        tap(() => {
          this._isLoading = true;
          this._changeDetectorRef.markForCheck();
        }),
        mergeMap((params: HttpParams) =>
          this._organizationService.getList(params).pipe(
            finalize(() => {
              this._isLoading = false;
              this._changeDetectorRef.markForCheck();
            })
          )
        )
      )
      .subscribe((response: IOrganizationResponse) => {
        this._organizations = response;
      });
  }
}
