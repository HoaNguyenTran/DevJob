import requestApi from 'api/config/requestApi'
import { validateResponse } from 'api/config/validateApi'
import { AxiosResponse } from 'axios'
import { configConstant } from 'src/constants/configConstant'
import { JobsDetailSchema, JobsSchema } from 'src/entities/JobInfo'



// interface patchJobApplyApiPayload {
//   jobId: number
//   data: {
//     userId: number
//     hiringStatus: number
//     reason?: number | null
//     reasonChangeStatus?: string
//   }
// }


// API get job

export const getSearchHotJobsApi = async (limit: number): Promise<AxiosResponse<JobGlobal.JobFull>> => {
  const res = await requestApi().get(`/jobs/search?limit=${limit}&isHotJob=1`)
  validateResponse("getSearchHotJobsApi", JobsSchema, res.data)
  return res
}

export const getSearchUrgentJobsApi = async (limit: number): Promise<AxiosResponse<JobGlobal.JobFull>> => {
  const res = await requestApi().get(`/jobs/search?limit=${limit}&urgent=1`)
  validateResponse("getSearchUrgentJobsApi", JobsSchema, res.data)
  return res
}

export const getSearchSuitableJobsApi = async (limit: number): Promise<AxiosResponse<JobGlobal.JobFull>> => {
  const res = await requestApi().get(`/jobs/search?limit=${limit}&sortBy=matching`)
  validateResponse("getSearchHotJobsApi", JobsSchema, res.data)
  return res
}

export const getSearchNewJobsApi = async (limit: number): Promise<AxiosResponse<JobGlobal.JobFull>> => {
  const res = await requestApi().get(`/jobs/search?limit=${limit}`)
  validateResponse("getSearchNewJobsApi", JobsSchema, res.data)
  return res
}

export const getSearchAroundJobsByLocationApi = async (
  { lat, lng, distance = 3000, limit = 72 }:
    { lat: number, lng: number, distance?: number, limit?: number }
): Promise<AxiosResponse<JobGlobal.JobFull>> => {
  const res = await requestApi().get(`/jobs/search?limit=${limit}&locationType=1&latitude=${lat}&longitude=${lng}&distance=${distance}`)
  validateResponse("getSearchAroundJobsByLocationApi", JobsSchema, res.data)
  return res
}

export const getSearchJobApi = async (params): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/jobs/search`, {
    params: {
      page: params.page || 1,
      limit: configConstant.limit.jobs,
      ...params
    }
  })
  validateResponse("getSearchJobApi", JobsSchema, res.data)
  return res
}


export const getDetailJobApi = async (id): Promise<AxiosResponse<JobDetailGlobal.JobDetailData>> => {
  const res = await requestApi().get(`/jobs/${id}`)
  validateResponse("getDetailJobApi", JobsDetailSchema, res.data)
  return res
}

export const deleteJobApi = (id: number): Promise<AxiosResponse<JobGlobal.Job>> =>
  requestApi().delete(`/jobs/${id}`)

export const patchUpdateJobApi = (id: number, data: any): Promise<AxiosResponse<any>> =>
  requestApi().patch(`/jobs/${id}`, data)

export const getSaveJobApi = async (payload: { pageNumber?: number }): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/user-saved-job?limit=10&page=${payload.pageNumber || 1}`)
  validateResponse("getSaveJobApi", JobsSchema, res.data)
  return res
}

export const getJobApplyApi = async ({
  pageNumber,
  jobId,
  status,
  role,
}: {
  pageNumber?: number
  jobId?: number
  status: number
  role: number
}): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/job-applying?limit=10&page=${pageNumber || 1}
  ${jobId ? `&jobs=${jobId}` : ''}&hiringStatus=${status}&kindOfPerson=${role}`)
  validateResponse("getJobApplyApi", JobsSchema, res.data)
  return res
}

export const postSaveJobApi = (data: JobApplyGlobal.JobApplyPayload): Promise<AxiosResponse<JobSaveGlobal.JobSaveResponse>> =>
  requestApi().post(`/user-saved-job`, data)

export const deleteSaveJobApi = (id: number): Promise<AxiosResponse<JobSaveGlobal.JobUnSaveResponse>> =>
  requestApi().delete(`/user-saved-job/${id}`)

export const postJobApplyApi = (data: JobApplyGlobal.JobApplyPayload): Promise<AxiosResponse<JobApplyGlobal.JobApplyResponse>> =>
  requestApi().post(`/job-applying`, data)

export const deleteJobApplyApi = ({ id, data }: { id: number, data: JobApplyGlobal.JobApplyUnReason }): Promise<AxiosResponse<JobApplyGlobal.JobApplyResponse>> =>
  requestApi().delete(`/job-applying/${id}`, { data })

export const patchJobApplyApi = (payload): Promise<AxiosResponse<JobApplyGlobal.JobApplyFull>> =>
  requestApi().patch(`/job-applying/change-status/${payload.jobId}`, payload.data)


export const getJobPostApi = async (query): Promise<AxiosResponse<JobPostGlobal.JobPostFull>> => {
  const res = await requestApi().get(`/jobs${query}`)
  validateResponse("getJobPostApi", JobsSchema, res.data)
  return res
}








export const postJobApi = (data: any): Promise<AxiosResponse<any>> =>
  requestApi().post(`/jobs`, data)


export const postUrgentJobApi = (data: any): Promise<AxiosResponse<any>> =>
  requestApi().post(`/jobs/urgent`, data)

export const postChangeStatusJobApi = (id: number, data: any): Promise<AxiosResponse<any>> =>
  requestApi().post(`/jobs/change-status/${id}`, data)

export const getHotCategoryApi = (): Promise<AxiosResponse<any>> =>
  requestApi().get("/hot-job-category")
