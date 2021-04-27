import { Component } from '@angular/core';

import { Constants } from '../../../core/utils/constants';
import { IReportComponent } from '../../../core/services/models';

@Component({
   selector: 'app-game-pop',
   templateUrl: './game-pop.component.html',
   styleUrls: ['./game-pop.component.scss']
})
export class GamePopComponent implements IReportComponent {

   reportData: any; /* input param for accepting data from service */
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   backgroungImgGreen = '../../../../assets/png/reports-bg-colors/006341_1x1.png';
   backgroungImgWhite = '../../../../assets/png/reports-bg-colors/eeeeee_1x1.png';

   constructor() { }

}
