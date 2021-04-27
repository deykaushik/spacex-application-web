import { SearchPipe } from './search.pipe';
import { ICountryListCheckboxDetails, ICountrycodes } from '../../core/services/models';

describe('Pipe: Default', () => {
   let pipe: SearchPipe;
   const searchText = 'Per';
   const emptySearchText = '';
   const countryListDetails: ICountrycodes = {
      code: '1234',
      description: 'Canada'
   };
   const countryListDetails1: ICountrycodes = {
      code: '5678',
      description: 'India'
   };
   const countryListDetails2: ICountrycodes = {
      code: '4567',
      description: 'Cuba'
   };

   const countryListCheckboxDetails: ICountryListCheckboxDetails[] = [{
      isChecked: false,
      countries: countryListDetails
   },
   {
      isChecked: true,
      countries: countryListDetails1
   },
   {
      isChecked: false,
      countries: countryListDetails2
   }];

   beforeEach(() => {
      pipe = new SearchPipe();
   });

   it('filter items based ons search text', () => {
      expect(pipe.transform(countryListCheckboxDetails, searchText)).toBeTruthy();
   });

   it('should return empty array for no items', () => {
      expect(pipe.transform(null, searchText)).toEqual([]);
   });

   it('should return items', () => {
      expect(pipe.transform(countryListCheckboxDetails, emptySearchText)).toEqual(countryListCheckboxDetails);
   });
});
