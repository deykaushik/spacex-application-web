import { TestBed, inject } from '@angular/core/testing';
import { TrusteerService } from './trusteer-service';
import { WindowRefService } from './../services/window-ref.service';
import { tick } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';

describe('TrusteerService', () => {
   let trusteerService: TrusteerService;

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [TrusteerService,
            {
               provide: WindowRefService,
               useValue: {
                  nativeWindow: {
                     location: {
                        href: jasmine.createSpy('href').and.returnValue('')
                     },
                     setTimeout
                  }
               }
            }]
      });
   });

   beforeEach(inject([TrusteerService], (service: TrusteerService) => {
      trusteerService = service;
   }));

   it('should be created', () => {
      expect(trusteerService).toBeTruthy();
   });

   it('should show Trusteer with subscription', () => {
      trusteerService.ShowTrusteer(true).subscribe((value) => {
         expect(value).toBeTruthy();
      });
      expect(trusteerService.trusteerDownloading).toBeFalsy();
   });

   it('should hide Trusteer with subscription', () => {
      trusteerService.ShowTrusteer(false).subscribe((value) => {
         expect(value).toBeFalsy();
      });
      expect(trusteerService.trusteerDownloading).toBeFalsy();
   });

   it('should hide Trusteer on Close', () => {
      spyOn(localStorage, 'setItem');
      trusteerService.CloseTrusteer();
      expect(localStorage.setItem).toHaveBeenCalled();
   });

   it('should Download', () => {
      trusteerService.DownloadTrusteer('test');
      expect(trusteerService.trusteerDownloading).toBeTruthy();
   });

   it('should not Download', () => {
      trusteerService.DownloadTrusteer(null);
      expect(trusteerService.trusteerDownloading).toBeFalsy();
   });

   it('should reset download variable', fakeAsync(() => {
      trusteerService.DownloadTrusteer('test');
      expect(trusteerService.trusteerDownloading).toBeTruthy();
      tick(101);
      expect(trusteerService.trusteerDownloading).toBeFalsy();
   }));
});
