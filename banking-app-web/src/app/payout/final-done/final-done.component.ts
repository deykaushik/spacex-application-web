import { Component, OnInit, ViewChild } from '@angular/core';
import { WindowRefService } from '../../core/services/window-ref.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PayoutService } from '../payout.service';
import { PreFillService } from '../../core/services/preFill.service';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-final-done',
   templateUrl: './final-done.component.html',
   styleUrls: ['./final-done.component.scss']
})

export class FinalDoneComponent implements OnInit {
   accountId: number;
   payoutType: string;
   goToAccountrouterLink: string;
   subjectLine: string;
   subject: string;
   doneLabels = Constants.labels.buildingLoan.donePage;
   doneMessages = Constants.messages.buildingLoan.donePage;
   doneContact = Constants.labels.buildingLoan.donePage.contact;
   constructor(private windowRef: WindowRefService, private route: ActivatedRoute,
      private prefillService: PreFillService, private router: Router) {
      this.route.params.subscribe(params => {
         this.accountId = params.accountId;
         this.payoutType = params.type;
      });
   }

   ngOnInit() {
      this.goToAccountrouterLink = Constants.routeUrls.accountDetail + this.accountId;
      this.subjectLine = this.doneMessages.subjectLine2 + this.prefillService.buildingBalanceData.accountNumber
         + this.doneMessages.subjectLine3;
      this.subject = this.doneMessages.subjectLine1 + this.subjectLine;
   }

   sendMail() {
      this.windowRef.nativeWindow.location.href = this.doneLabels.mailTo + this.subjectLine;
   }
   goToAccounts() {
      this.router.navigateByUrl(this.goToAccountrouterLink);
   }
}
