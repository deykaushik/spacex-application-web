import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, CanActivate, } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SubmenuConstants } from '../../shared/constants';
import { TermsService } from './../../shared/terms-and-conditions/terms.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { TermsAndConditionsComponent } from './../../shared/terms-and-conditions/terms-and-conditions.component';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class TermsConditionGuard implements CanActivate {
   bsModalRef: BsModalRef;

   constructor(private termsService: TermsService, private modalService: BsModalService,
      @Inject(DOCUMENT) private document: Document) { }

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): Observable<boolean> {
      let lastslashindex = state.url.lastIndexOf('/');
      let path = state.url.substring(lastslashindex + 1);
      if (!isNaN(Number(path))) {
         path = state.url.substring(0, lastslashindex);
         lastslashindex = path.lastIndexOf('/');
         path = path.substring(lastslashindex + 1);
      }
      const submenus = [];
      Object.keys(SubmenuConstants.VariableValues).forEach(menu => {
         SubmenuConstants.VariableValues[menu].forEach(submenu => {
            submenus.push(submenu);
         });
      });


      const submenu = submenus.filter(item => item.path === path && item.termsTypes && item.termsTypes.length !== 0)[0];
      if (submenu) {
         return Observable.create(observer => {
            const includeTypes: string[] = submenu.termsTypes;
            this.termsService.getTerms().subscribe(
               termsResponse => {
                  if (termsResponse && termsResponse.data && termsResponse.data.length > 0) {
                     const filteredTerms = this.termsService.filterTerms(termsResponse.data, [], includeTypes);
                     if (filteredTerms && filteredTerms.length > 0) {
                        const config = {
                           animated: true,
                           keyboard: false,
                           backdrop: true,
                           ignoreBackdropClick: true
                        };
                        this.document.body.classList.add('custom-html-printing');
                        this.bsModalRef = this.modalService.show(
                           TermsAndConditionsComponent,
                           Object.assign({}, config, { class: 'modal-lg terms-after-login' })
                        );
                        this.bsModalRef.content.termsAndConditionsModel = filteredTerms;
                        this.bsModalRef.content.isAcceptButtonVisible = true;
                        this.bsModalRef.content.iconCls = submenu.iconCls;
                        this.bsModalRef.content.conditionText = submenu.termsText;


                        this.modalService.onHidden.asObservable().subscribe(() => {
                           if (this.termsService.isAccepted) {
                              observer.next(true);
                              observer.complete();
                           } else {
                              observer.next(false);
                              observer.complete();
                           }
                           this.document.body.classList.remove('custom-html-printing');
                        });
                     } else {
                        observer.next(true);
                        observer.complete();
                     }
                  } else {
                     observer.next(true);
                     observer.complete();
                  }
               },
               (error) => {
                  observer.next(false);
                  observer.complete();
               }
            );
         });
      } else {
         return Observable.of(true);
      }
   }
}
