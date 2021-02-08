import { CommonUtility } from "./common";

export class Constants {
  public static logoText = 'SpaceX Launch Programs';
  public static developer = 'Kaushik Dey';

  public static labels = {
    developedBy: 'Developed by',
    filters: 'Filters',
    launchYear: 'Launch Year',
    successfulLaunch: 'Successful Launch',
    successfulLanding: 'Successful Landing',
    missionId: 'Mission Ids',
    loadingMsg: 'Loading...',
    noItemFound: 'No item found for your current selection !!!'
  }

  public static filters = {
    years: CommonUtility.getYearList(2006, 2020),
    launch: [true, false],
    land: [true, false]
  }
}