export class CommonUtility {
  public static getYearList(startYear: number, endYear: number) {
    let years: number[] = [];
    let yearNum: number = startYear;
    while (yearNum <= endYear) {
      years.push(yearNum);
      yearNum++;
    }
    return years;
  }
}
