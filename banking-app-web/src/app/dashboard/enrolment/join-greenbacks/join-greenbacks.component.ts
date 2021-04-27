import {
   Component, ViewEncapsulation, Inject, Injector,
   Renderer2, ElementRef, OnInit
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';

import { CommonUtility } from './../../../core/utils/common';
import { Constants } from './../../../core/utils/constants';
import { ITermsAndConditions } from './../../../core/services/models';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { GreenbacksEnrolmentService } from './../../../core/services/greenbacks-enrolment.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { TermsAndConditionsComponent } from './../../../shared/terms-and-conditions/terms-and-conditions.component';

import { GreenbacksConfirmationComponent } from './../greenbacks-confirmation/greenbacks-confirmation.component';

@Component({
   selector: 'app-join-greenbacks',
   templateUrl: './join-greenbacks.component.html',
   styleUrls: ['./join-greenbacks.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class JoinGreenbacksComponent extends BaseComponent implements OnInit {

   // Whether user has accepted T&C or not.
   public isAccepted = false;
   // To show progress loader or not.
   public showLoader = false;

   /**
    * Creates an instance of JoinGreenbacksComponent.
    * @param {BsModalService} modalService
    * @param {BsModalRef} bsModalRef
    * @param {SystemErrorService} errorService
    * @param {GreenbacksEnrolmentService} enrolmentService
    * @memberof JoinGreenbacksComponent
    */
   constructor(private modalService: BsModalService,
      @Inject(DOCUMENT) public document: Document,
      private bsModalRef: BsModalRef,
      private errorService: SystemErrorService,
      private enrolmentService: GreenbacksEnrolmentService,
      private renderer: Renderer2,
      private element: ElementRef,
      injector: Injector) {
      super(injector);
   }

   /**
    * Close the current modal.
    *
    * @memberof JoinGreenbacksComponent
    */
   close() {
      this.sendEvent('rewards_not_joined_gb_enrolment');
      this.bsModalRef.hide();
   }

   /**
    * Join the user to the greenbacks program, also notify the
    * user about success/failure.
    *
    * @memberof JoinGreenbacksComponent
    */
   joinProgram() {
      this.showLoader = true;
      this.enrolmentService.acceptTermsAndConditions().subscribe(() => {
         this.enrolmentService.enrolCustomer().subscribe(res => {
            this.showLoader = false;
            const status = CommonUtility.getResultStatus(res.metadata);
            if (status.isValid) {
               this.sendEvent('rewards_joined_gb_enrolment');
               this.bsModalRef.hide();
               this.enrolmentService.storeCustomerInLocalStorage();
               this.showConfirmation(this.enrolmentService.getEnroledAccountNumber(res.data));
            } else {
               this.errorService.raiseError({ error: status.reason });
            }
         }, err => {
            this.showLoader = false;
         });
      });
   }

   /**
    * Fetch terms and condition data on view init.
    *
    * @memberof JoinGreenbacksComponent
    */
   ngOnInit() {
      this.enrolmentService.fetchTermsAndConditions();
   }

   /**
    * Show the confirmation popup to the user along with the account
    * number of the newly create greenbacks account.
    *
    * @param {string} accountNumber
    * @memberof JoinGreenbacksComponent
    */
   showConfirmation(accountNumber: string) {
      const modalRef: any = this.modalService
         .show(GreenbacksConfirmationComponent, Constants.fullScreenModalConfig);
      modalRef.content.accountNumber = accountNumber;
   }

   /**
    * Show the T&C page to the user whose data is fetch from the server.
    *
    * @memberof JoinGreenbacksComponent
    */
   showTermsAndConditions() {
      const bsModalRef = this.modalService.show(
         TermsAndConditionsComponent,
         Object.assign({}, { class: 'modal-lg terms-after-login' })
      );
      bsModalRef.content.termsAndConditionsModel = this.enrolmentService.termsToAccept;
      bsModalRef.content.isAcceptButtonVisible = false;
      this.renderer.setStyle(this.element.nativeElement, 'visibility', 'hidden');
      this.document.body.classList.add('custom-html-printing');
      this.modalService.onHidden.asObservable().take(1).subscribe(() => {
         this.renderer.setStyle(this.element.nativeElement, 'visibility', 'visible');
         this.document.body.classList.remove('custom-html-printing');
      });
   }
}
