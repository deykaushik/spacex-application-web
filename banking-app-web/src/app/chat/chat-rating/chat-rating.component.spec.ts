import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRatingComponent } from './chat-rating.component';
import { PreFillService } from '../../core/services/preFill.service';
import { assertModuleFactoryCaching } from '../../test-util';
import { IChatQuestion } from '../../core/services/models';

describe('ChatRatingComponent', () => {
   assertModuleFactoryCaching();
   let component: ChatRatingComponent;
   let fixture: ComponentFixture<ChatRatingComponent>;

   const preFillServiceStub = new PreFillService();

   const mockQuesionStub: IChatQuestion = {
      questionOne: 'How was your experience?',
      questionTwo: 'How was the chat?'
   };

   preFillServiceStub.chatData = {
      agentDisconnected: false,
      chatsFEHistory: [],
      agentName: 'Rituja',
      chats: [],
      chatsFE: [],
      fillDetails: false,
      nedBankLogo: false,
      questionNumber: 0,
      yesClicked: false,
      questions: mockQuesionStub
   };

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ChatRatingComponent],
         providers: [{ provide: PreFillService, useValue: preFillServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ChatRatingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set the rating', () => {
      const starObj = {
         state: 'disable',
         counter: 0
      };
      component.setActiveStarState(starObj);
      expect(component.ratingSelected).toBe(true);
   });

   it('should reset the rating', () => {
      const starObj = {
         state: 'Active',
         counter: 0
      };
      component.stars = [starObj];
      component.ratingSelected = false;
      component.resetActiveStar();
      expect(component.stars[0].state).toBe('disabled');
   });

});
