import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { GamePopComponent } from './game-pop.component';

describe('GamePopComponent', () => {
   let component: GamePopComponent;
   let fixture: ComponentFixture<GamePopComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [GamePopComponent, AmountTransformPipe]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(GamePopComponent);
      component = fixture.componentInstance;
      component.reportData = {
         gameDetails: {
            ClientRequestedDate: '2017-11-01',
            FromAccount: {
               AccountNumber: '1001005570',
               accountType: 'CA'
            },
            transactionID: '1234',
            Game: 'PWB',
            GameType: 'QPK',
            DrawNumber: 805,
            DrawDate: '2017-11-21',
            DrawsPlayed: 2,
            BoardsPlayed: 3,
            IsLottoPlus: false,
            IsLottoPlusTwo: false,
            MyDescription: 'LOTTO after accepting T\'s and C\'s',
            Favourite: false,
            BoardDetails: [],
            NotificationDetail: [{
               NotificationType: 'EMAIL',
               NotificationAddress: 'refilwemn@nedbank.co.za'
            }
            ]
         },
         execEngineRef: 'some ref',
         selectedNumbers: {
            FromAccount: {
               accountNumber: '123'
            },
            TotalCost: 123,
            IsLottoPlus: false
         }
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
