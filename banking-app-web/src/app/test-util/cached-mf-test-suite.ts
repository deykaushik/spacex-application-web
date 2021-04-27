import { getTestBed, TestBed, ComponentFixture, TestModuleMetadata } from '@angular/core/testing';
import { } from 'jasmine';
import { TestCopyUtil } from './copy-util';

export const assertModuleFactoryCaching = () => {
   const testBed: any = getTestBed();
   const originConfigure = TestBed.configureTestingModule;
   const originReset = TestBed.resetTestingModule;
   let providers = [];

   beforeAll(() => {
      TestBed.resetTestingModule();
      TestBed.resetTestingModule = () => TestBed;

      TestBed.configureTestingModule = (moduleDef: TestModuleMetadata) => {
         // get the providers info.
         if (moduleDef.providers) {
            providers = moduleDef.providers;
         }
         testBed.configureTestingModule(moduleDef);
         return TestBed;
      };
   });

   afterEach(() => {
      // reset providers
      providers.forEach(element => {
         if (element.provide && element.useValue) {
            const data = testBed._moduleRef._def.providers.find(ele => ele.token === element.provide);
            data.value = TestCopyUtil.deepCopy(element.useValue);
         }
      });
      // destroy component
      testBed._activeFixtures.forEach(function (fixture) {
         try {
            fixture.destroy();
         } catch (e) {
            console.error('Error during cleanup of component', fixture.componentInstance);
         }
      });
      testBed._activeFixtures = [];
      testBed._instantiated = false;
   });

   afterAll(() => {
      TestBed.configureTestingModule = originConfigure;
      TestBed.resetTestingModule = originReset;
      TestBed.resetTestingModule();
   });
};
