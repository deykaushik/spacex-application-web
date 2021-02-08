import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlightService } from 'src/app/core/services/flight.service';
import { Constants } from 'src/app/core/utils/constants';
import { DashboardService } from '../dashboard.service';
import { IFlightModel } from '../model';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightListComponent implements OnInit, OnDestroy {

  flightList$!: Observable<IFlightModel[]>;
  labels = Constants.labels;

  private destroy = new Subject();
  constructor(
    private flightService: FlightService,
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  updateRouteParms(queryParams: any) {
    this.router.navigate([], { queryParams });
  }

  ngOnInit(): void {
    this.dashboardService.selectionUpdated
      .pipe(takeUntil(this.destroy))
      .subscribe(queryParms => {
        this.flightList$ = this.flightService.getAllFlights(queryParms || {})
        this.updateRouteParms(queryParms);
      })
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
