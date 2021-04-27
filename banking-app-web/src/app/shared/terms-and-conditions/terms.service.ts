import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseContentType } from '@angular/http/src';
import { Headers } from '@angular/http';
import * as Pako from 'pako';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { ApiService } from '../../core/services/api.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { Constants } from '../../core/utils/constants';
import { IApiResponse, IUser, ITermsAndConditions, ITermsAccept, ITermsNedbankId, INedIDTermsAccept } from '../../core/services/models';
import { TermsAndConditionsConstants } from './constants';
@Injectable()
export class TermsService {

   isAccepted = false;

   constructor(private apiService: ApiService,
      private datePipe: DatePipe,
      private tokenManagementService: TokenManagementService) { }

   getTerms(): Observable<any> {
      return this.apiService.TermsAndConditions.getAll();
   }

   getNedIdTerms(): Observable<any> {
      return this.apiService.NedbankIdTermsAndConditions.getAll();
   }

   getLatestAcceptedNedIdTerms(profile: number): Observable<any> {
      const queryString = {};
      const routeParams = { profile: profile };

      return this.apiService.NedbankIdTermsAndConditionsLatest.getAll(queryString, routeParams)
         .map((response) => {
            return response;
         });
   }

   accept(terms: ITermsAndConditions[]): Observable<any> {
      const termsAccept = this.convertToTermsAccept(terms, this.datePipe);
      return Observable.of(this.acceptTerms(termsAccept));
   }

   acceptTerms(terms: ITermsAccept[]): Observable<any> {
      const self = this;
      const failed = false;
      terms.forEach(function (termAccept) {
         self.acceptTerm(termAccept);
      });
      return Observable.of(Constants.statusDescriptions.successful);
   }

   acceptTerm(term: ITermsAccept): any {
      return this.apiService.AcceptTermsAndConditions.updateById(term.noticeType, term)
         .take(1)
         .subscribe(response => response.metadata);
   }

   acceptProfileTerms(terms: ITermsAndConditions[]): Observable<boolean> {

      return new Observable(observable => {

         const termsAccept = this.convertToTermsAccept(terms, this.datePipe);
         termsAccept.forEach(termAccept => {
            this.acceptProfileTerm(termAccept)
               .finally(() => {
                  observable.complete();
               })
               .take(1)
               .subscribe(response => {
                  observable.next(response);
               },
                  (error) => {
                     observable.error();
                  });
         });
      });
   }

   acceptProfileTerm(termAccept: ITermsAndConditions): Observable<boolean> {
      return new Observable(observable => {
         this.apiService.AcceptTermsAndConditions.updateById(termAccept.noticeType, termAccept)
            .finally(() => {
               observable.complete();
            })
            .take(1)
            .subscribe(response => {
               if (response && response.metadata && response.metadata.resultData &&
                  response.metadata.resultData.length > 0 &&
                  response.metadata.resultData[0].resultDetail &&
                  response.metadata.resultData[0].resultDetail.length > 0 &&
                  response.metadata.resultData[0].resultDetail[0].result === 'R00') {
                  observable.next(true);
               } else {
                  observable.next(false);
               }
            },
               (error) => {
                  observable.error();
               });
      });
   }

   acceptNedIdTerms(terms: ITermsAndConditions[]): Observable<boolean> {
      const term: INedIDTermsAccept = {
         Version: {
            VersionNumber: terms[0].versionNumber,
            VersionDate: terms[0].noticeDetails.versionDate
         },
         AcceptedDateTime: moment().format(Constants.formats.YYYYMMDDTHHmmssZ),
      };
      const userId = this.getNedUserId();

      return new Observable(observable => {
         if (terms && terms.length > 0) {
            this.apiService.NedbankIdTermsAndConditionsAccept.updateById(userId, term)
               .finally(() => {
                  observable.complete();
               })
               .take(1)
               .subscribe(response => {
                  if (response && response.ErrorCode && response.ErrorCode === 'R00') {
                     observable.next(true);
                     observable.complete();
                  } else {
                     observable.next(false);
                     observable.complete();
                  }
               },
                  (error) => {
                     observable.error();
                  });
         } else {
            observable.next(false);
         }
      });
   }

   bytesToString(arr): string {
      let str = '';
      for (let i = 0; i < arr.length; i++) {
         str += String.fromCharCode(arr[i]);
      }
      return str;
   }

   filterTerms(items: ITermsAndConditions[], exclude: string[] = [], include: string[] = []): ITermsAndConditions[] {

      const list: ITermsAndConditions[] = [];
      if (items) {
         items.forEach((terms) => {
            if (terms.noticeDetails && terms.noticeDetails.noticeContent && terms.noticeType &&
               (exclude.length > 0 && exclude.indexOf(terms.noticeType) === -1) ||
               (include.length > 0 && include.indexOf(terms.noticeType) > -1)) {
               if (terms.noticeDetails != null && terms.noticeDetails.noticeContent !== null) {
                  const decoded = atob(terms.noticeDetails.noticeContent);
                  const inflated = this.bytesToString(Pako.inflateRaw(decoded));

                  const txt = document.createElement('textarea');
                  txt.innerHTML = inflated;
                  txt.value = txt.value.replace(TermsAndConditionsConstants.removeSpecialChars, '');

                  txt.value = txt.value.replace(new RegExp(TermsAndConditionsConstants.lessThanCode, 'g'),
                     TermsAndConditionsConstants.lessThanSign);
                  txt.value = txt.value.replace(new RegExp(TermsAndConditionsConstants.greaterThanCode, 'g'),

                     TermsAndConditionsConstants.greaterThanSign);
                  txt.value = txt.value.replace(TermsAndConditionsConstants.removeNbsp, ' ');
                  terms.noticeDetails.noticeContent = txt.value;
                  list.push(terms);
               }
            }
         });
      }
      return list;
   }

   decodeTerms(item: string): string {
      const list: ITermsAndConditions[] = [];
      if (item) {
         const decoded = atob(item);
         const inflated = this.bytesToString(Pako.inflateRaw(decoded));

         const txt = document.createElement('textarea');
         txt.innerHTML = inflated;
         txt.value = txt.value.replace(TermsAndConditionsConstants.removeSpecialChars, '');
         txt.value = txt.value.replace(new RegExp(TermsAndConditionsConstants.lessThanCode, 'g'),
            TermsAndConditionsConstants.lessThanSign);
         txt.value = txt.value.replace(new RegExp(TermsAndConditionsConstants.greaterThanCode, 'g'),
            TermsAndConditionsConstants.greaterThanSign);
         item = txt.value;
      }
      return item;
   }

   decodeTermsContent(content: string): Observable<string> {
      return this.decodeTermsObservable(content)
         .take(1)
         .map(decodeResponse => {
            let response = '';
            if (decodeResponse) {
               response = decodeResponse;
            }
            return response;
         });
   }

   decodeTermsObservable(item: string): Observable<string> {
      return new Observable(observable => {
         const list: ITermsAndConditions[] = [];
         if (item) {

            const decoded = atob(item);
            const inflated = this.bytesToString(Pako.inflateRaw(decoded));

            const txt = document.createElement('textarea');
            txt.innerHTML = inflated;
            txt.value = txt.value.replace(TermsAndConditionsConstants.removeSpecialChars, '');
            item = txt.value;
         }
         observable.next(item);
         observable.complete();
      });
   }

   convertToTermsAccept(terms: ITermsAndConditions[], datePipe: DatePipe): ITermsAccept[] {

      const result: ITermsAccept[] = [];

      terms.forEach(function (s) {

         const term: ITermsAccept = {
            noticeType: '',
            versionNumber: 0,
            newVersionNumber: 0,
            acceptedDateTime: '',
            noticeDetails: {
               versionDate: '',
            },
            accepted: true
         };

         if (s.noticeDetails) {
            if (s.acceptedDateTime === Constants.defaultValues.minDateTime) {
               term.versionNumber = s.versionNumber;
               term.newVersionNumber = s.versionNumber;
            } else {
               term.versionNumber = s.newVersionNumber;
               term.newVersionNumber = s.newVersionNumber;
            }
            term.acceptedDateTime = moment().format(Constants.formats.YYYYMMDDhhmmssA);
            term.noticeDetails.versionDate = s.noticeDetails.versionDate;
            term.accepted = true;
            term.noticeType = s.noticeType;
            result.push(term);
         }
      });
      return result;
   }

   convertToSingleTerm(termToShow: string, version: number = 0, versionDate: string = ''): ITermsAndConditions[] {
      const termsItems: ITermsAndConditions[] = [];
      const term = {
         noticeTitle: '',
         noticeType: '',
         versionNumber: version,
         newVersionNumber: 0,
         acceptedDateTime: '',
         noticeDetails: { noticeContent: termToShow, versionDate: versionDate }
      };
      termsItems.push(term);
      return termsItems;
   }

   downloadPDF(): Observable<any> {
      return this.apiService.DownloadTermsAndConditions.getBlob(Constants.mimeTypes.applicationPDF, {});
   }

   getNedUserId(): number {
      const token = this.tokenManagementService.getAuthToken();
      if (token) {
         return this.getNedbankUserId(token);
      }
   }

   getNedbankUserId(token: string): number {
      const decodedToken = this.decodeJwt(token);
      return decodedToken.sub;
   }

   decodeJwt(token: string) {
      return jwt_decode(token);
   }
}
