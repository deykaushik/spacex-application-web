import { TestBed, inject } from '@angular/core/testing';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';
import { ReportsService } from './reports.service';
import { ClientProfileDetailsService } from '../core/services/client-profile-details.service';
import { Observable } from 'rxjs/Observable';

describe('ReportsService', () => {
   const clientProfileDetailsServiceStub = {
      clientDetailsObserver: Observable.of({ FirstName: 'Anuj', PreferredName: 'AN', FullNames: 'Anuj Sharma' })
   };
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ReportsService, BsModalService,
            BsModalRef,
            ComponentLoaderFactory,
            ModalBackdropComponent,
            PositioningService, { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub }]
      });
   });

   it('should be created', inject([ReportsService], (service: ReportsService) => {
      expect(service).toBeTruthy();
   }));
});
