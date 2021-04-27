import { TestBed, inject } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { TermsService } from './terms.service';
import { ApiService } from '../../core/services/api.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { TokenRenewalService } from '../components/token-renewal-expiry/token-renewal-expiry.service';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';
import { environment } from './../../../environments/environment';

import { ITermsAndConditions } from './../../core/services/models';

let shouldReturnEmptyList: Boolean = false;

const  token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5OTg3MjE3NDg0IiwidG9rZW5fdHlwZSI6IkJlY' +
'XJlciIsImN0eSI6IndlYiIsInVjaWQiOiJjbGllbnQiLCJCdXNpbmVzc0VudGl0eVVzZXJJZCI6IjMwMTgyMjk4NjkuMDAwMDAiLCJpc3MiOi' +
'JpZHAubmVkYmFuay5jby56YSIsImFwaWQiOiJhcGkiLCJhdWQiOiIyZTgxMDY3MS0wMDFlLTQ5MjItYjVlNS0xNjdhY2JhMzg4YjUiLCJzZXN' +
'zaW9uaWQiOiJjYzU5OGExOS00ODhhLTQyZDgtYWNlMS1jOGI1NzQ3YmU1ZmQiLCJuYmYiOjE1MTM4NTY5NjAsImlhdCI6MTUxMzg1NzAyMCwi' +
'ZXhwIjoxNTEzODc1MDIwLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwiY2lkIjoiMSIsInNjb3BlcyI6WyJOZWRiYW5rSURVc' +
'2VyLlNlbGZTZXJ2aWNlQ2xpZW50Il0sImp0aSI6ImNjNTk4YTE5NDg4YTQyZDhhY2UxYzhiNTc0N2JlNWZkIn0.JP3EJjA_gXizW-u2VaWoO4' +
'He8RPHAgirb8lQn5GqAEks3M1Tu0lH8RvDQQ3kcdDmNPsGr7GEOuhQO24vWRtfTt_R4xs2GJnZfc-M9iP6bHpnR8G20S8huOqPY6ksDEvkQrB' +
'oJIpZh6BIaUxi9TghOOrY7Y3KqJ2BF5upqX5OdReDxaJ4teFj0Wva2NRxoqjWD-SYLdXT00szDyyVxJloECZMKv7gPog0YUBQV16ydgd6z_p9' +
'ah1GjO7tEEeEFR4H8zJRTvf1-wHfWhCGmgRWpiPqL4nMq9SMtH1kLO7SjbFUycCmjxEdS5NyQpqwGmNAteW5E7ppkdfFVXNQOi8I8Q';


const mockTerms: ITermsAndConditions[] = [{
   'noticeTitle': 'Terms and conditions item 1',
   'noticeType': 'ABC',
   'versionNumber': 0.01,
   'acceptedDateTime': '2017-01-01 14:00 AM',
   'newVersionNumber': 0.02,
   'noticeDetails': {
      'noticeContent': 'C0ktyi1WSMxLUUjOz0vJLMnMzysGMUtS80oUMktScxUMAQ==',
      'versionDate': '2017-01-01 14:00 AM'
   }
},
{
   'noticeTitle': 'Terms and conditions item 1',
   'noticeType': 'ABC',
   'versionNumber': 0.01,
   'acceptedDateTime': '2017-01-01 14:00 AM',
   'newVersionNumber': 0.02
}];

const emptyTerms: ITermsAndConditions[] = [{}];

const mockTermsNeverAccepted: ITermsAndConditions[] = [{
   'noticeTitle': 'Terms and conditions item 1',
   'noticeType': 'ABC',
   'versionNumber': 0.01,
   'acceptedDateTime': '0001-01-01 12:00:00 AM',
   'newVersionNumber': 0.02,
   'noticeDetails': {
      'noticeContent': 'C0ktyi1WSMxLUUjOz0vJLMnMzysGMUtS80oUMktScxUMAQ==',
      'versionDate': '2017-01-01 14:00 AM'
   }
}];

const metadataSuccess = {
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: '',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   },
   Data: {
      ApproveITInfo: { ApproveITVerificationID: 1 }
   }
};


const mockBlobData: String = 'Test blob data';

const mockUserData = jasmine.createSpy('getAll').and.callFake(function () {
   if (shouldReturnEmptyList) {
      return Observable.of(emptyTerms);
   } else {
      return Observable.of(mockTerms);
   }
});
const mockUserAccept = jasmine.createSpy('updateById').and.returnValue(Observable.of(metadataSuccess));
const mockDownload = jasmine.createSpy('getBlob').and.returnValue(Observable.of(mockBlobData));
const mockTermsGetLatest = jasmine.createSpy('getAll').and.returnValue(Observable.of(getTerms));

function getTerms(): Observable<any> {

   const terms: ITermsAndConditions[] = [];
   const term: ITermsAndConditions = {
      noticeTitle: 'Test Title LTO',
      noticeType: 'LTO',
      versionNumber: 1,
      acceptedDateTime: '',
      noticeDetails: {
         noticeContent: 'C0ktyi1WSMxLUUjOz0vJLMnMzysGMUtS80oUMktScxV8QvwB',
         versionDate: ''
      }
   };
   terms.push(term);
   const term1: ITermsAndConditions = {
      noticeTitle: 'Test Title PPE',
      noticeType: 'PPE',
      versionNumber: 1,
      acceptedDateTime: '',
      noticeDetails: {
         noticeContent: 'C0ktyi1WSMxLUUjOz0vJLMnMzysGMUtS80oUMktScxUCAlwB',
         versionDate: ''
      }
   };
   terms.push(term1);
   const term2: ITermsAndConditions = {
      noticeTitle: 'Test Title IPN',
      noticeType: 'IPN',
      versionNumber: 1,
      acceptedDateTime: '',
      noticeDetails: {
         noticeContent: 'C0ktyi1WSMxLUUjOz0vJLMnMzysGMUtS80oUMktScxU8A/wA',
         versionDate: ''
      }
   };
   terms.push(term2);
   const term3: ITermsAndConditions = {
      noticeTitle: 'Test Title EPM',
      noticeType: 'EPM',
      versionNumber: 1,
      acceptedDateTime: '',
      noticeDetails: {
         noticeContent: 'C0ktyi1WSMxLUUjOz0vJLMnMzysGMUtS80oUMktScxVcA3wB',
         versionDate: ''
      }
   };
   terms.push(term3);
   const ret = { 'data': terms };
   return Observable.of(ret);
}

describe('TermsService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [HttpClient, HttpHandler, TermsService,
            {
               provide: ApiService, useValue: {
                  TermsAndConditions: {
                     getAll: mockUserData
                  },
                  AcceptTermsAndConditions: {
                     updateById: mockUserAccept
                  },
                  DownloadTermsAndConditions: {
                     getBlob: mockDownload
                  },
                  NedbankIdTermsAndConditions: {
                     getAll: mockUserData
                  },
                  NedbankIdTermsAndConditionsLatest: {
                     getAll: mockTermsGetLatest
                  }
               }
            }, TokenManagementService, TokenRenewalService,
            BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule,
            DatePipe]
      });
   });

   it('should be created', inject([TermsService, DatePipe], (service: TermsService) => {
      expect(service).toBeTruthy();
   }));

   it('should get terms list', inject([TermsService], (service: TermsService) => {
      shouldReturnEmptyList = false;
      service.getTerms().subscribe(response => {
         expect(response).toBeDefined();
         expect(response.length).toBeGreaterThan(0);
         expect(response.length).toEqual(mockTerms.length);
         const _term = response[0];
         const _mockItem = mockTerms[0];
         expect(_term.acceptedDateTime).toEqual(_mockItem.acceptedDateTime);
         expect(_term.newVersionNumber).toEqual(_mockItem.newVersionNumber);
         expect(_term.noticeDetails).toEqual(_mockItem.noticeDetails);
         expect(_term.noticeTitle).toEqual(_mockItem.noticeTitle);
         expect(_term.noticeType).toEqual(_mockItem.noticeType);
         expect(_term.versionNumber).toEqual(_mockItem.versionNumber);
      });
      expect(mockUserData).toHaveBeenCalled();
   }));

   it('should get terms list for Nedbank Id', inject([TermsService], (service: TermsService) => {
      shouldReturnEmptyList = false;
      service.getNedIdTerms().subscribe(response => {
         expect(response).toBeDefined();
      });
      expect(mockUserData).toHaveBeenCalled();
   }));

   it('should filter list', inject([TermsService], (service: TermsService) => {
      const t = service.filterTerms(mockTerms);
      expect(t).toBeDefined();
   }));

   it('should filter empty list', inject([TermsService], (service: TermsService) => {
      const t = service.filterTerms(null);
      expect(t).toBeDefined();
   }));

   it('should accept', inject([TermsService], (service: TermsService) => {
      service.accept(mockTerms).subscribe(t => {
         expect(t).toBeDefined();
      });
   }));

   it('should downloadPDF', inject([TermsService], (service: TermsService) => {
      service.downloadPDF().subscribe(t => {
         expect(t).toBeDefined();
      });
   }));

   it('should accept - never accepted before', inject([TermsService], (service: TermsService) => {
      service.accept(mockTermsNeverAccepted).subscribe(t => {
         expect(t).toBeDefined();
      });
   }));

   it('should give single term', inject([TermsService], (service: TermsService) => {
      const term = 'lotto';
      const terms = service.convertToSingleTerm(term);
      expect(terms.length).toBe(1);
      expect(terms[0].noticeDetails.noticeContent).toBe(term);
   }));

   it('should decode term', inject([TermsService], (service: TermsService) => {
      const term = mockTerms[0].noticeDetails.noticeContent;
      expect(service.decodeTerms(term)).toBe('Terms and conditions content item 1');
   }));

   it('should handle decode empty term', inject([TermsService], (service: TermsService) => {
      const term = '';
      expect(service.decodeTerms(term)).toBe('');
   }));

   it('should filter list with includs  and excludes', inject([TermsService], (service: TermsService) => {
      const t = service.filterTerms(mockTermsNeverAccepted, ['LTE'], ['PPE']);
      expect(t).toBeDefined();
   }));

   it('should filter list with includs  and excludes', inject([TermsService], (service: TermsService) => {
      const mockTerm = mockTermsNeverAccepted;
      mockTerm[0].noticeDetails = null;
      const t = service.filterTerms(mockTerm, ['LTE'], ['PPE']);
      expect(t).toBeDefined();
   }));

   it('should return latest accepted Ned id terms', inject([TermsService, ApiService], (service: TermsService, apiService) => {
      shouldReturnEmptyList = false;

      service.getLatestAcceptedNedIdTerms(1).subscribe(response => {
         expect(response).toBeDefined();
      });

   }));

   it('should accept profile terms', inject([TermsService], (service: TermsService) => {
      service.acceptProfileTerms(mockTerms).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should be able to get the user id from the auth token', inject([TermsService, TokenManagementService],
      (service, tokenManagementService) => {

      environment.logoutOnRefresh = true;
      spyOn(tokenManagementService, 'SetTokenRenewalTimer').and.stub();
      tokenManagementService.setAuthToken(token);

      const user = service.getNedUserId();

      expect(user).toBe('9987217484');
   }));

   it('should be able to decode terms and conditions', inject([TermsService], (service: TermsService) => {

      const encryptedTerms = 'C0ktyi1WSMxLUUjOz0vJLMnMzysGMUtS80oUMktScxUMAQ==';

      service.decodeTermsContent(encryptedTerms).subscribe(response => {
         expect(response).toBe('Terms and conditions content item 1');
      });

   }));

});
