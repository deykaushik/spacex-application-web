import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertActionType, AlertMessageType } from '../../enums';
import { environment } from '../../../../environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../../test-util';
import { TrusteerComponent } from './trusteer.component';
import { SharedModule } from '../../shared.module';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { TrusteerService } from '../../../core/services/trusteer-service';
import { WindowRefService } from '../../../core/services/window-ref.service';
import { inject } from '@angular/core/testing';

describe('TrusteerComponent', () => {
   let component: TrusteerComponent;
   let fixture: ComponentFixture<TrusteerComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TrusteerComponent],
         providers: [WindowRefService,
            {
               provide: TrusteerService, useValue: {
                  DownloadTrusteer: jasmine.createSpy('DownloadTrusteer').and.stub(),
                  CloseTrusteer: jasmine.createSpy('CloseTrusteer').and.stub(),
               }
            }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TrusteerComponent);
      component = fixture.componentInstance;
      window['trusteerLink'] = '';
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should handle Close Action', inject([TrusteerService], (trusteerService) => {
      component.onCloseMsg(null);
      expect(trusteerService.CloseTrusteer).toHaveBeenCalled();
   }));

   it('should handle Download Action - Do not download', inject([TrusteerService], (trusteerService) => {
      component.onDownload(null);
      expect(trusteerService.DownloadTrusteer).not.toHaveBeenCalled();
   }));

   it('should handle Download Action - Download success', inject([TrusteerService], (trusteerService) => {
      window['trusteerLink'] = 'Test URL';
      component.onDownload(null);
      expect(trusteerService.DownloadTrusteer).toHaveBeenCalled();
   }));
});
