import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { INoticePayload } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';

@Component({
   selector: 'app-view-notices',
   templateUrl: './view-notices.component.html',
   styleUrls: ['./view-notices.component.scss']
})
export class ViewNoticesComponent implements OnInit {

   constructor() { }

   tableData: INoticePayload;
   isNoticeAvailable: boolean;
   labels = Constants.labels.nowLabels;
   dateFormat = Constants.formats.ddMMMyyyy;
   amountPipeConfig = Constants.amountPipeSettings.amountWithPrefix;

   @Output() backNotices = new EventEmitter<boolean>();
   @Output() viewNotices = new EventEmitter<INoticePayload>();
   @Input() allNotices;
   @Input() investmentType: string;
   @Input() accNumber: number;

   ngOnInit() {
      if (this.allNotices && (this.allNotices[0].noticeID !== '')) {
         this.isNoticeAvailable = true;
         this.tableData = this.allNotices;
         CommonUtility.topScroll();
      } else {
         this.isNoticeAvailable = false;
      }
   }

   back() {
      this.backNotices.emit(false);
   }

   noticeDetails(data) {
      this.viewNotices.emit(data);
   }

}
