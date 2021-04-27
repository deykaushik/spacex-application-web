import { Component, OnInit } from '@angular/core';

import { Constants } from '../../../core/utils/constants';
import { IReportComponent } from '../../../core/services/models';

@Component({
  selector: 'app-transfer-pop',
  templateUrl: './transfer-pop.component.html',
  styleUrls: ['./transfer-pop.component.scss']
})
export class TransferPopComponent implements OnInit, IReportComponent {

  reportData: any; /* input param for accepting data from service */
  amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
  constructor() { }

  ngOnInit() {
  }

}
