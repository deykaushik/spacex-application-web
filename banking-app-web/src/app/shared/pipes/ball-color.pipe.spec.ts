import { BallColorPipe } from './ball-color.pipe';
import { Constants } from '../../core/utils/constants';
import { PreFillService } from '../../core/services/preFill.service';
import { async, TestBed, inject } from '@angular/core/testing';

const preFillServiceStub = new PreFillService();

const dataStub = {
   isReplay: true,
   isEdit: true,
   drawName: 'LOTTO'
};
preFillServiceStub.activeData = dataStub;

describe('BallColorPipe', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [{ provide: PreFillService, useValue: preFillServiceStub }]
      });
   });
   it('create an instance', inject([PreFillService], (preFillService: PreFillService) => {
      const pipe = new BallColorPipe(preFillService);
      expect(pipe).toBeTruthy();
   }));

   it('should return the red ball color class', inject([PreFillService], (preFillService: PreFillService) => {
      const pipe = new BallColorPipe(preFillService);
      expect(pipe.transform(13, 'colors')).toBe('ball-border-red');
   }));
   it('should return the yellow ball color class', inject([PreFillService], (preFillService: PreFillService) => {
      const pipe = new BallColorPipe(preFillService);
      expect(pipe.transform(21, 'colors')).toBe('ball-border-yellow');
   }));
   it('should return the green ball color class', inject([PreFillService], (preFillService: PreFillService) => {
      const pipe = new BallColorPipe(preFillService);
      expect(pipe.transform(35, 'colors')).toBe('ball-border-green');
   }));
   it('should return the blue ball color class', inject([PreFillService], (preFillService: PreFillService) => {
      const pipe = new BallColorPipe(preFillService);
      expect(pipe.transform(48, 'colors')).toBe('ball-border-blue');
   }));
   it('should return the division 1 correct balls for lotto', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'Lotto';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(1, 'correctballs');
      expect(masked).toBe('Six correct balls');
   }));
   it('should return the division 2 correct balls for lotto', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'Lotto';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(2, 'correctballs');
      expect(masked).toBe('Five correct balls + bonus ball');
   }));
   it('should return the division 3 correct balls for lotto', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'Lotto';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(3, 'correctballs');
      expect(masked).toBe('Five correct balls');
   }));
   it('should return the division 4 correct balls for lotto', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'Lotto';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(4, 'correctballs');
      expect(masked).toBe('Four correct balls + bonus ball');
   }));
   it('should return the division 5 correct balls for lotto', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'Lotto';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(5, 'correctballs');
      expect(masked).toBe('Four correct balls');
   }));
   it('should return the division 6 correct balls for lotto', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'Lotto';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(6, 'correctballs');
      expect(masked).toBe('Three correct balls + bonus ball');
   }));
   it('should return the division 7 correct balls for lotto', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'Lotto';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(7, 'correctballs');
      expect(masked).toBe('Three correct balls');
   }));
   it('should return the division 8 correct balls for lotto', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'Lotto';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(8, 'correctballs');
      expect(masked).toBe('Two correct balls + bonus ball');
   }));
   it('should return the division 1 correct balls for PowerBall', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'PowerBall';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(1, 'correctballs');
      expect(masked).toBe('Five correct balls + PowerBall');
   }));
   it('should return the division 2 correct balls for PowerBall', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'PowerBall';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(2, 'correctballs');
      expect(masked).toBe('Five correct balls');
   }));
   it('should return the division 3 correct balls for PowerBall', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'PowerBall';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(3, 'correctballs');
      expect(masked).toBe('Four correct balls + PowerBall');
   }));
   it('should return the division 4 correct balls for PowerBall', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'PowerBall';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(4, 'correctballs');
      expect(masked).toBe('Four correct balls');
   }));
   it('should return the division 5 correct balls for PowerBall', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'PowerBall';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(5, 'correctballs');
      expect(masked).toBe('Three correct balls + PowerBall');
   }));
   it('should return the division 6 correct balls for PowerBall', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'PowerBall';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(6, 'correctballs');
      expect(masked).toBe('Three correct balls');
   }));
   it('should return the division 7 correct balls for PowerBall', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'PowerBall';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(7, 'correctballs');
      expect(masked).toBe('Two correct balls + PowerBall');
   }));
   it('should return the division 8 correct balls for PowerBall', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'PowerBall';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(8, 'correctballs');
      expect(masked).toBe(' One correct balls + PowerBall');
   }));
   it('should return the division 9 correct balls for PowerBall', inject([PreFillService], (preFillService: PreFillService) => {
      preFillService.activeData.drawName = 'PowerBall';
      const pipe = new BallColorPipe(preFillService);
      const masked = pipe.transform(9, 'correctballs');
      expect(masked).toBe('Match PowerBall');
   }));
});
