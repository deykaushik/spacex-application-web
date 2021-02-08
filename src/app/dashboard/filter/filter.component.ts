import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/core/utils/constants';
import { DashboardService } from '../dashboard.service';
import { FilterType, IFlightsQueryParms } from '../model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {
  constants = Constants;
  labels: any = this.constants.labels;
  filters = this.constants.filters;
  selectedOption: IFlightsQueryParms = {};

  private destroy = new Subject();

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.selectionUpdated
      .pipe(takeUntil(this.destroy))
      .subscribe(selected => this.selectedOption = selected)
  }

  onFilterSelection(value: boolean | number, filterType: FilterType) {
    this.dashboardService.updateSelection(value, filterType);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
