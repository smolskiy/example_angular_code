import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { IStatistic } from '@shared/models';
import { StatisticService } from '@shared/services';
import { Animation } from '../../../../utils/animation';

@Component({
  selector: 'tsp-organization-stats-list',
  templateUrl: './organization-stats-list.component.html',
  styleUrls: ['./organization-stats-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animation.fadeAnimation],
  providers: [StatisticService],
})
export class OrganizationStatsListComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  private _statistic: IStatistic[] = [];
  private _isLoading: boolean = false;

  public get statistic(): IStatistic[] {
    return this._statistic;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  constructor(
    private readonly _statisticService: StatisticService,
    private readonly _changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this._getStatistic();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _getStatistic(): void {
    this._isLoading = true;
    this._statisticService
      .organizations()
      .pipe(
        takeUntil(this._destroy$),
        finalize(() => {
          this._isLoading = false;
          this._changeDetectorRef.detectChanges();
        })
      )
      .subscribe((statistic: IStatistic[]) => {
        this._statistic = statistic;
      });
  }
}
