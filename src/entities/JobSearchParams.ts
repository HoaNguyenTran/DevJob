/* eslint-disable lines-between-class-members */

export default class JobSearchParams{
  search?: string|undefined = undefined;
  page?: number = 1;
  limit?: number = 100;
  fields?: string|undefined = undefined;
  jobType?: number = 1;
  shifts?: number[]|undefined = undefined;
  categories?: number[]|undefined = undefined;
  companyId?:  number|undefined = undefined;
  jobStatus?: number|undefined = undefined;
  isHotJob?: number|undefined = undefined;
  isSavedJob?: number|undefined = undefined;
  urgent?: number|undefined = undefined;
  locationType?: number|undefined = undefined;
  districtIds?: number[]|undefined = undefined;
  latitude?: number|undefined = undefined;
  longitude?: number|undefined = undefined;
  distance?: number|undefined = undefined;
  userId?: number|undefined = undefined;
}
