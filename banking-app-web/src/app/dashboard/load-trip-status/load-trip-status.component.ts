import { Component, OnInit, EventEmitter } from '@angular/core';
import { Constants } from '../../core/utils/constants';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-load-trip-status',
  templateUrl: './load-trip-status.component.html',
  styleUrls: ['./load-trip-status.component.scss']
})
export class LoadTripStatusComponent implements OnInit {

   successful: boolean;
   labels = Constants.labels;
   isNoResponseReceived: boolean;
   heading: string;
   refId: string;
   errorMessage: string;
  constructor(private accountService: AccountService) { }

  ngOnInit() {

     this.successful = true;
     this.isNoResponseReceived = false;
     this.heading = this.labels.loadTripLabels.loadTripSuccessText;
     this.refId = this.accountService.referenceNumber;
  }

  closeStatus() {
   this.accountService.loadTripStatusEmitter.emit(false);
  }

}
