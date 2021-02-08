import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilterType, IFlightsQueryParms } from "./model";

@Injectable()
export class DashboardService implements OnDestroy {
  queryParms: IFlightsQueryParms = {};
  selectionUpdated = new BehaviorSubject<IFlightsQueryParms>({});

  updateSelection(value: boolean | number, filter: FilterType) {
    if (this.queryParms[filter] === value) {
      return;
    }
    switch (filter) {
      case 'launch_year':
        this.queryParms.launch_year = value as number;
        break;
      case 'launch_success':
        this.queryParms.launch_success = value as boolean;
        break;
      case 'land_success':
        this.queryParms.land_success = value as boolean;
        break;
    }
    this.selectionUpdated.next({ ...this.queryParms });
  }

  ngOnDestroy() {
    this.selectionUpdated.next({});
    this.selectionUpdated.complete();
  }
}