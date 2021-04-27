import { Component, OnInit, Input, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { Constants } from '../../../core/utils/constants';
import { IClientDetails, IDocumentList } from '../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';
import { GAEvents } from '../../../core/utils/ga-event';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-documents',
   templateUrl: './documents.component.html',
   styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent extends BaseComponent implements OnInit {
   @Input() documentList: IDocumentList[];
   @Input() itemAccountId: string;
   @Input() accountType: string;
   labels = Constants.labels.statementAndDocument.documents;
   values = Constants.VariableValues.statementAndDocument;
   isRegistrationPaperActive: boolean;
   email: string;
   clientDetails: IClientDetails;
   isDocumentClick: boolean;

   constructor(private clientPreferences: ClientProfileDetailsService, private router: Router, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      if (this.documentList) {
         this.getClientDetails();
         this.addClickFlag();
      }
   }

   addClickFlag() {
      this.documentList.forEach((flag) => {
         flag['isDocumentClick'] = false;
      });
   }

   getClientDetails() {
      this.clientDetails = this.clientPreferences.getClientPreferenceDetails();
      if (this.clientDetails) {
         this.email = this.clientDetails.EmailAddress;
      }
   }

   toggleDocumentType(currentIndex) {
      if (!this.documentList[currentIndex].isDocumentClick) {
         this.sendGAEvent(this.documentList[currentIndex]);
      }
      if (this.documentList[currentIndex].documentType === this.values.mfcCrossBorderLetter) {
         this.router.navigateByUrl(encodeURI(Constants.routeUrls.crossBorder + this.itemAccountId));
      } else {
         this.documentList[currentIndex].isDocumentClick = !this.documentList[currentIndex].isDocumentClick;
      }
   }

   sendGAEvent(documentList: IDocumentList) {
      const category = CommonUtility.format(GAEvents.statementsAndDocuments.request.category,
         CommonUtility.isMfcvafLoan(this.accountType) ?
            Constants.VariableValues.statementAndDocument.mfc : this.accountType.toLowerCase());
      const eventAction = CommonUtility.format(GAEvents.statementsAndDocuments.request.eventAction,
         CommonUtility.isMfcvafLoan(this.accountType) ?
            Constants.VariableValues.statementAndDocument.mfc : this.accountType.toLowerCase(),
            documentList.documentDescription.toLowerCase());
      this.sendEvent(eventAction, GAEvents.statementsAndDocuments.request.label, null, category);
   }
}
