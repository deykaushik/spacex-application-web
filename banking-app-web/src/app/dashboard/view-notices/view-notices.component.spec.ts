import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewNoticesComponent } from './view-notices.component';
import { INoticePayload, IViewNoticeDetails } from '../../core/services/models';
import { assertModuleFactoryCaching } from './../../test-util';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';

describe('ViewNoticesComponent', () => {
  let component: ViewNoticesComponent;
  let fixture: ComponentFixture<ViewNoticesComponent>;
  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNoticesComponent, AmountTransformPipe ]
    })
    .compileComponents();
  }));

  const mockNotice: IViewNoticeDetails[] = [{
    noticeID: 'NOW123456',
    noticeDate: '2018-08-03',
    noticeAmount: 500,
    capitalDisposalAccount:
    {
      accountNumber: 123456789,
      accountType: 'DS'
    }
  }];

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNoticesComponent);
    component = fixture.componentInstance;
    component.allNotices = mockNotice;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty notice when all notice is will be false', () => {
    component.allNotices =  [{
      noticeID: ''
    }];
    component.ngOnInit();
    expect(component.isNoticeAvailable).toBe(false);
  });

  it('should be call back function', () => {
    component.back();
    component.backNotices.subscribe(data => {
      expect(data).toBe(false);
   });
  });

  it('should be call noticeDetails function ', () => {
    const data = {
        investmentNumber: '123456-5678',
        noticeDate: '2018-08-03',
        noticeAmount: 500,
        capitalDisposalAccount:
        {
          accountNumber: 123456789,
          accountType: 'DS'
        }
    };
     component.noticeDetails(data);
     component.viewNotices.subscribe(result => {
      expect(result).toBe(true);
   });
  });
});
