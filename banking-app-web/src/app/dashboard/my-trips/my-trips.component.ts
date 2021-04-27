import { Component, OnInit, Input, Inject  } from '@angular/core';
import { Constants } from '../../core/utils/constants';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { DataService } from '../fund-trip/data.service';
import { IDashboardAccount } from '../../core/services/models';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.scss']
})
export class MyTripsComponent implements OnInit {
  labels = Constants.labels;
  loadTripOverlayVisible: boolean;
  loadTripStatusOverlayVisible: boolean;
  loadTripStatusEmitter;
  trips: any;
  skeletonMode: boolean;
  serviceUnavailable: boolean;
  _account: IDashboardAccount;
  accountNumber: number;
  dateFormat: string = Constants.formats.ddMMMyyyy;
  loadTripRefEmitter;
  @Input()
  set account(account: IDashboardAccount) {
    this.accountNumber = account ? account.AccountNumber : null;
    this._account = account;
  }

  constructor(private router: Router, private accountService: AccountService, private dataService: DataService,
   @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.skeletonMode = true;
    this.loadTripStatusEmitter = this.accountService.loadTripStatusEmitter.subscribe(loadTripResult => {
      this.showLoadTripStatus(loadTripResult);
    });
    this.loadTripRefEmitter = this.accountService.loadTripRefEmitter.subscribe(referenceResult => {
      this.accountService.referenceNumber = referenceResult;
    });
    this.accountService.getAllTrips(this.accountNumber).subscribe(response => {
      this.trips = response ? response.trips : [];
      this.serviceUnavailable = false;
      this.skeletonMode = false;
    }, errorResponse => {
      if ( errorResponse.error && errorResponse.error.resultCode !== Constants.statusCode.errorCodeR03) {
         this.serviceUnavailable = true;
      } else {
         this.serviceUnavailable = false;
      }
      this.skeletonMode = false;
    });
  }
  showLoadTripStatus(loadTripResult: any) {
    this.loadTripOverlayVisible = false;
    this.loadTripStatusOverlayVisible = loadTripResult;
    if (!loadTripResult) {
      this.document.body.classList.remove('overlay-no-scroll');
    }
  }
  openFundTrip(trip: any) {

    this.dataService.setData(trip, this._account);
    this.router.navigate(['/dashboard/fundtrip']);
  }
  openLoadTrip() {
    this.loadTripOverlayVisible = true;
  }
  resetLoadTrip() {
    this.loadTripOverlayVisible = false;
    this.loadTripStatusOverlayVisible = false;
  }
  showHideBuyCurrencyButton(trip) {
    return (trip.tripStatus === this.labels.myTripLabels.tripStatusActive ||
      trip.tripStatus === this.labels.myTripLabels.tripStatusFutureYes)
      && (trip.topupAllowed.toLowerCase() !== 'no');
  }
}
