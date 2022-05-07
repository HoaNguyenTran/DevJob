
import { AxiosResponse } from 'axios'
import requestApi from 'api/config/requestApi'
import { validateResponse } from 'api/config/validateApi'
import { JobsSchema } from 'src/entities/JobInfo'

export const getDetailJobSSRApi = async ({ token, id }): Promise<AxiosResponse<JobDetailGlobal.JobDetailData>> => {
  const res = await requestApi({ token }).get(`/jobs/${id}`)
  validateResponse("getDetailJobSSRApi", JobsSchema, res.data)
  return res;
}

