import { Injectable, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { LandingComponent } from './landing/landing.component';
import { DOCUMENT } from '@angular/common';
import { ISubscription } from 'rxjs/Subscription';
import { ClientProfileDetailsService } from '../core/services/client-profile-details.service';
import { CommonUtility } from '../core/utils/common';

@Injectable()
export class ReportsService {

   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   paidByName: string;
   constructor(public modalService: BsModalService, private clientProfileDetailsService: ClientProfileDetailsService,
      @Inject(DOCUMENT) private document: Document) {
      this.clientProfileDetailsService.clientDetailsObserver.subscribe(response => {
         if (response) {
            this.paidByName = response.oldFullNames || (response.FirstName + response.Surname) || response.PreferredName;
         }
      });
   }

   open(reportComponent: any, reportData: any, config?: any) {
      const defaultConfig = {
         animated: true, keyboard: false, backdrop: true, ignoreBackdropClick: true, class: 'modal-lg', title: 'Report Print'
      };
      const extraConfig = Object.assign({}, defaultConfig, config);

      this.bsModalRef = this.modalService.show(LandingComponent, extraConfig);
      this.document.body.classList.add('custom-html-printing');
      this.bsModalRef.content.reportConfig = extraConfig;
      this.bsModalRef.content.dynamicReportComponent = reportComponent;
      reportData.paidByName = this.paidByName;
      this.bsModalRef.content.dynamicReportdata = reportData;
      this.bsModalRef.content.loadComponent();
      this.modalSubscription = this.modalService.onHidden.asObservable()
         .subscribe(() => {
            this.document.body.classList.remove('custom-html-printing');
            this.modalSubscription.unsubscribe();
         });
   }
}
