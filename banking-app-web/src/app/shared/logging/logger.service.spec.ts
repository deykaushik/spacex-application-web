import { TestBed, inject } from '@angular/core/testing';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';
import { ApiService } from '../../core/services/api.service';
import { LoggerService } from './logger.service';
import { AuthConstants } from '../../auth/utils/constants';
import { TokenManagementService } from '../../core/services/token-management.service';
import { TokenRenewalService } from '../../shared/components/token-renewal-expiry/token-renewal-expiry.service';

describe('LoggerService', () => {
  let mockLog: any;
  mockLog = jasmine.createSpy('create').and.stub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService,
        {
          provide: ApiService, useValue: {
            LogEntry: {
                  create: mockLog
              }
          }
        },
        TokenManagementService, TokenRenewalService,
        BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService,
        ModalBackdropComponent, ModalModule
      ]
    });
  });

  it('should be created', inject([LoggerService], (service: LoggerService) => {
    expect(service).toBeTruthy();
  }));

});
