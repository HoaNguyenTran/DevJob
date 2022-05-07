import React, { useEffect, useRef, useState } from 'react'

import { Col, Collapse, Dropdown, Form, Menu, Pagination, Row, Select, Skeleton } from 'antd'
import { getDetailJobApi, getSaveJobApi, getSearchJobApi } from 'api/client/job'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import Job from 'src/components/elements/Job/Job'
import OutstandingProfessions from 'src/components/modules/HomePage/components/OutstandingProfessions/OutstandingProfessions'
import JobDetailPage from 'src/components/modules/JobDetail/JobDetailPage'
import { configConstant } from 'src/constants/configConstant'
import { dayOfWeekConstant } from 'src/constants/dayOfWeekConstant'
import jobConstant from 'src/constants/jobConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { useAppSelector } from 'src/redux'
import { convertTimeToHHmm, filterSelectOption, filterSortSelectOption, handleError } from 'src/utils/helper'
import { setUserRoleCookieSSR } from 'src/utils/storage'

/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'

import styles from './Search.module.scss'

const { Option } = Select
const outstandingJobConstant = {
  hotJob: 1,
  urgentJob: 2
}

const filterList = [
  {
    key: 'news',
    label: "Ngày đăng mới nhất",
  },
  {
    key: 'matching',
    label: "Phù hợp nhất",
  },
]

export default function SearchPage(): JSX.Element {
  const [form] = Form.useForm();
  const { t } = useTranslation()
  const router = useRouter()
  const refInp = useRef<HTMLInputElement>(null)

  const {
    FjobExperience = [],
    FjobProvince: provinceList = [],
    FjobDistrict: districtList = [],
    FjobCategory: categoryList = [],
    JobType: jobTypeList = [],
    FjobEducationLevel: EducationList = [],
  } = useAppSelector(state => state.initData.data)

  const filterKey = router.query.sortBy ? String(router.query.sortBy) : 'news'

  const [jobs, setJobs] = useState<any>()

  const [loading, setLoading] = useState(false)
  const [toggleFilter, setToggleFilter] = useState(false)
  const [dataJobPreview, setDataJobPreview] = useState({});
  const [loadingPreview, setLoadingPreview] = useState(false);


  const categoryParent = categoryList.filter(cat => cat.parentId === 0)

  const handleClickSave = async () => {
    const resData = await getSaveJobApi({})
    // setResSave(resData.data)
  }

  const onChangePagi = (pageNumber: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: pageNumber,
      }
    })
  }
  const activeItemGroup = (id) => {
    const newDataGroups = (jobs?.data || []).map(item => ({
      ...item,
      isActive: item.id === id
    }));
    setJobs({
      ...jobs,
      data: newDataGroups
    })
  }
  async function fetchData(params) {
    if (!params.jobId) setLoading(true)
    try {
      const resData = await getSearchJobApi(params)

      let newDataGroups = resData.data?.data || [];

      if (router.query.jobId) {
        const data = await loadingDataPreview(Number(router.query.jobId));
        if(router.query.isOtherPage) {
          newDataGroups = newDataGroups.filter(item => item.id !== Number(data?.id));
          newDataGroups.unshift(data)
        }
        newDataGroups = newDataGroups.map(item => ({
          ...item,
          isActive: item.id === Number(router.query.jobId)
        }));
      }

      setJobs({
        ...resData.data,
        data: newDataGroups
      })

    } catch (error) {
      handleError(error)
      setJobs({ data: [] })
    } finally {
      setLoading(false)
      setLoadingPreview(false)
    }
  }
  const handleKeyDown = async event => {
    if (event.key === 'Enter') {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          search: event.target.value,
        }
      })
    }
  }

  const changeRoutePreviewJob = (data) => {
    const tempQuery = {...router.query}
    if (data.id !== Number(router.query.jobId)) {
      if(tempQuery.isOtherPage) delete tempQuery.isOtherPage;
      setLoadingPreview(true)
      router.push({
        pathname: router.pathname,
        query: {
          ...tempQuery,
          jobId: data.id
        }
      })
    }
  }
  const loadingDataPreview = async (id) => {
    try {
      const { data } = await getDetailJobApi(id);
      setDataJobPreview(data);
      return data;
    } catch (error) {
      handleError(error)
    }
  }
  const searchJobs = async (values) => {
    // console.log(values);
    try {
      const query: any = {
      }

      if (values.genders) {
        query.genders = [values.genders]
      }

      if (values.search) {
        query.search = values.search
      }
      if (values.rangeWage) {
        const rangeWage = JSON.parse(values.rangeWage || '[]');
        query.wageUnit = 5 // monthly
        if (rangeWage.length) {
          query.wageMin = rangeWage[0]
          query.wageMax = rangeWage[1]
        } else {
          // check lương thỏa thuận
          query.wageMin = values.rangeWage[0]
        }
      }

      if (values.categories) {
        query.categories = [values.categories]
      }

      if (values.provinceId) {
        query.provinceId = values.provinceId
        query.locationType = 2 // search by district or province
      }
      if (values.experienceId !== undefined) {
        query.experienceId = values.experienceId;
      }
      if (values.experienceId) {
        query.experienceId = values.experienceId;
      }
      if (values.outstandingJob) {
        if (values.outstandingJob === outstandingJobConstant.hotJob) {
          query.isHotJob = 1
        }
        if (values.outstandingJob === outstandingJobConstant.urgentJob) {
          query.urgent = 1
        }
      }
      if (values.jobType) {
        query.jobType = values.jobType
      }
      if (values.educationLevel) {
        query.educationLevel = values.educationLevel
      }
      delete query.jobId;
      router.push({
        pathname: router.pathname,
        query
      })
    } catch (e) {
      handleError(e)
    }
  }
  const deleteAdvancedFilter = () => {
    form.setFieldsValue({
      experienceId: null,
      rangeWage: null,
      outstandingJob: null,
      educationLevel: null,
      genders: null,
      jobType: null,
    })
  }
  useEffect(() => {
    if (router.query.jobId) {
      // loadingDataPreview(Number(router.query.jobId))
      // activeItemGroup(Number(router.query.jobId))
    }
    form.setFieldsValue({
      search: String(router.query.search || ""),
    })
    if (router.query.categories) {
      form.setFieldsValue({
        categories: Number(router.query.categories),
      })
    }
    if (router.query.provinceId) {
      form.setFieldsValue({
        provinceId: Number(router.query.provinceId),
      })
    }
    if (router.query.isHotJob) {
      form.setFieldsValue({
        outstandingJob: 1,
      })
      // setToggleFilter(true)
    }
    if (router.query.urgent) {
      form.setFieldsValue({
        outstandingJob: 2,
      })
      // setToggleFilter(true)
    }
    fetchData(router.query)
  }, [JSON.stringify(router.query)])

  // useEffect(() => {
  //   if (!router.query.sortBy) {
  //     router.push({
  //       pathname: router.pathname,
  //       query: {
  //         ...router.query,
  //         sortBy: "news"
  //       }
  //     })
  //   }
  // }, [])

  useEffect(() => {
    if (Object.keys(dataJobPreview).length) {
      setLoadingPreview(false)
    }
  }, [JSON.stringify(dataJobPreview)])

  const onSelectFilter = ({ key }) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sortBy: key }
    })
  }

  const menuFilter = (
    <Menu onClick={onSelectFilter}>
      {
        filterList.map(i => (
          <Menu.Item key={i.key}>
            <div>
              {i.label}
            </div>
          </Menu.Item>
        ))
      }
    </Menu>
  );

  return (
    <>
      <NextSeo title="Tìm kiếm việc làm" description="Tìm kiếm việc làm" />
      <div className={`${styles.job} search`}>
        <Form
          form={form}
          onFinish={searchJobs}
          autoComplete="off"
        >
          <Collapse expandIconPosition="right" activeKey={toggleFilter ? ['1'] : []} >
            <Collapse.Panel
              showArrow={false}
              key="1"
              header={(
                <div style={{ width: 1200, margin: '0 auto' }}>
                  <div className={styles.job_header} >
                    <Row gutter={[10, 10]} className="search_select justify-space-between">
                      <Col xs={24} md={7} className={`${styles.job_condition_search} d-flex align-items-center w-100`}>
                        <div className={`${styles.job_condition_input} w-100`}>
                          <Form.Item
                            name="search"
                            className='mb-0'
                          >
                            <input
                              placeholder="Tên công việc, vị trí..."
                              ref={refInp}
                              onKeyDown={handleKeyDown}
                            />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col xs={24} md={5} className={styles.job_header_list}>
                        <Form.Item
                          name="categories"
                          className='mb-0'
                        >
                          <Select
                            placeholder="Ngành nghề"
                            allowClear
                            showSearch
                            className={styles.job_header_select_top}
                            filterOption={filterSelectOption}
                            optionFilterProp="children"
                            filterSort={filterSortSelectOption}
                            style={{ width: "100%" }}
                          >
                            {categoryParent.map((item, index) => (
                              <Option
                                key={item.id}
                                value={item.id}
                              >

                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={5} className={styles.job_header_list}>
                        <Form.Item
                          name="provinceId"
                          className='mb-0'
                        >
                          <Select
                            placeholder="Địa điểm"
                            allowClear
                            showSearch
                            className={styles.job_header_select_top}
                            filterOption={filterSelectOption}
                            optionFilterProp="children"
                          >
                            {provinceList.map((item, index) => (
                              <Option
                                key={index}
                                value={item.id}
                              >
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={3}>
                        <div className={styles.job_header_search}>
                          <button type="submit">
                            {t('search.search')}
                          </button>
                        </div>
                      </Col>
                      <Col xs={24} md={4}>
                        <div className={styles.job_header_advanced_filter}>
                          <button type="button" onClick={() => setToggleFilter(!toggleFilter)} className='d-flex align-items-center justify-content-center'>
                            Lọc nâng cao
                            {
                              toggleFilter ?
                                <CaretDownOutlined className='text-white ml-2' /> : <CaretRightOutlined className='text-white ml-2' />
                            }
                          </button>
                        </div>
                      </Col>

                    </Row>
                  </div>
                  <div className={toggleFilter ? styles.job_header_bottom_active : styles.job_header_bottom_inactive} />
                </div>)}>
              <div className={styles.job_condition}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className='text-primary cursor-pointer font-weight-500' onClick={() => deleteAdvancedFilter()} >
                    Lọc nâng cao:
                  </div>
                  <div className='text-primary cursor-pointer font-weight-500 mr-3' onClick={() => deleteAdvancedFilter()} >
                    Xoá chọn
                  </div>
                </div>

                <Row gutter={[10, 10]} className={styles.job_condition_wrap}>
                  <Col xs={24} md={4} className={styles.job_condition_sort}>
                    <div className={styles.job_condition_main}>
                      <Form.Item
                        name="experienceId"
                        className='mb-0'
                      >
                        <Select
                          placeholder="Kinh nghiệm"
                          allowClear
                          className={styles.job_header_select}
                        >
                          <Option
                            value={1}
                          >
                            Không yêu cầu
                          </Option>
                          {FjobExperience.map((item, index) => (
                            <Option
                              key={index}
                              value={item.id}
                            >
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col xs={24} md={4} className={styles.job_condition_sort}>
                    <div className={styles.job_condition_main}>
                      <Form.Item
                        name="rangeWage"
                        className='mb-0'

                      >
                        <Select
                          placeholder="Mức lương"
                          allowClear
                          className={styles.job_header_select}
                        >
                          {jobConstant.rangeSalary.map((item, index) => (
                            <Option
                              key={index}
                              value={JSON.stringify(item.value)}
                            >
                              {item.text}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col xs={24} md={4} className={styles.job_condition_filter}>
                    <div className={styles.job_condition_main}>
                      <Form.Item
                        name="outstandingJob"
                        className='mb-0'
                      >
                        <Select
                          // getPopupContainer={trigger => trigger.parentNode}
                          allowClear
                          placeholder="Hình thức"
                          className={styles.job_header_select}
                        >
                          <Option value={outstandingJobConstant.hotJob}>Công việc hot</Option>
                          <Option value={outstandingJobConstant.urgentJob}>Tuyển gấp</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col xs={24} md={4} className={styles.job_condition_sort}>
                    <div className={styles.job_condition_main}>
                      <Form.Item
                        name="jobType"
                        className='mb-0'
                      >
                        <Select
                          allowClear
                          className={styles.job_header_select}
                          placeholder="Loại hình công việc"
                        >

                          {jobTypeList.map((item, index) => (
                            <Option
                              key={index}
                              value={item.id}
                            >
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col xs={24} md={4} className={styles.job_condition_sort}>
                    <div className={styles.job_condition_main}>
                      <Form.Item
                        name="educationLevel"
                        className='mb-0'
                      >
                        <Select
                          placeholder="Trình độ"
                          allowClear
                          className={styles.job_header_select}
                        >
                          {EducationList.map(education => (
                            <Option
                              key={education.id}
                              value={education.id}
                              label={t('search.salaryFromHighToLow')}
                            >
                              {education.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col xs={24} md={4} className={styles.job_condition_sort}>
                    <div className={styles.job_condition_main}>
                      <Form.Item
                        name="genders"
                        className='mb-0'
                      >
                        <Select
                          placeholder="Giới tính"
                          allowClear
                          className={styles.job_header_select}
                        >
                          {Object.keys(configConstant.gender).map((item, index) => (
                            <Option
                              key={index}
                              value={configConstant.gender[item].key}
                            >
                              {configConstant.gender[item].text}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>

                </Row>
              </div>
            </Collapse.Panel>
          </Collapse>


          <div className={styles.job_main}>
            <Row className={styles.job_main_tab}>
              <Col md={12} xs={24} className={styles.job_main_left}>
                {jobs?.meta?.pagination?.total
                  ? (
                    <>
                      <span>Kết quả tìm kiếm <span className='font-weight-bold'>({jobs?.meta?.pagination?.total})</span> tin đăng</span>
                      <Dropdown overlay={menuFilter}>
                        <div className={styles.main_wrap_filter_select}>
                          <div className={styles.main_wrap_filter_select_text}>
                            {filterList.find(i => i.key === filterKey)?.label || ""}
                          </div>
                          <CaretDownOutlined style={{ color: "#6E00C2" }} />
                        </div>
                      </Dropdown>
                    </>
                  )
                  : 'Không tìm thấy kết quả nào'
                }
              </Col>
            </Row>
            {
              loading ?
                <>
                  <Skeleton avatar paragraph={{ rows: 4 }} />
                  <Skeleton avatar paragraph={{ rows: 4 }} className="mt-4" />
                </>
                :
                <Row className={styles.job_main_content}>
                  <Col xs={24} md={router.query.jobId ? 12 : 24}>
                    <Row className="justify-content-between" style={{
                      maxHeight: router.query.jobId ? "735px" : "unset",
                      overflow: router.query.jobId ? "auto" : "unset"
                    }}
                    >
                      {
                        jobs?.data.map((job, i) => {
                          const {
                            id,
                            companyId,
                            title,
                            urgent,
                            workingAddress,
                            wageMin,
                            wageMax,
                            wageUnit,
                            canApplyDate,
                            user,
                            company,
                            jobSchedules,
                            matching,
                            isHotJob,
                            isSavedJob,
                            distance,
                            applyingStatus,
                            isActive,
                          } = job

                          const ownPost = {
                            ownJobId: user.id,
                            ownJobName: user.name,
                            ownJobAvatar: "",
                          }

                          if (companyId) {
                            ownPost.ownJobId = company?.id
                            ownPost.ownJobName = company?.name
                            ownPost.ownJobAvatar = company?.avatar
                          }

                          const renderSchedule = () => {
                            const workSchedule: any = []
                            let workDay = ''
                            const arrHour: any = []
                            if (!jobSchedules) return
                            if (jobSchedules[0].dayOfWeek === 1) {
                              workDay = 'Hằng ngày'
                            } else {
                              workDay = 'Thứ '
                              const arrWorkDay: any[] = []
                              jobSchedules.map(
                                item =>
                                  !arrWorkDay.includes(item.dayOfWeek) &&
                                  arrWorkDay.push(item.dayOfWeek),
                              )
                              if (arrWorkDay.length === 1 && arrWorkDay[0] === dayOfWeekConstant.sunday.key)
                                workDay = "CN"
                              else {
                                arrWorkDay.sort().forEach(item => {
                                  if (item === dayOfWeekConstant.sunday.key) workDay += 'CN, '
                                  else workDay += `${item}, `
                                })
                                workDay = workDay.slice(0, -2)
                              }
                            }

                            if (!jobSchedules[0].shiftId) {
                              arrHour.push({
                                workTimeFrom: jobSchedules[0].workTimeFrom,
                                workTimeTo:
                                  jobSchedules[0].workTimeTo >= 24
                                    ? jobSchedules[0].workTimeTo - 24
                                    : jobSchedules[0].workTimeTo,
                              })
                            } else {
                              const arrShift: any = []

                              jobSchedules.forEach(
                                schedule =>
                                  !arrShift.includes(schedule.shiftId) &&
                                  arrShift.push(schedule.shiftId) &&
                                  arrHour.push({
                                    workTimeFrom: schedule.workTimeFrom,
                                    workTimeTo:
                                      schedule.workTimeTo >= 24
                                        ? String(schedule.workTimeTo - 24).concat('.00')
                                        : schedule.workTimeTo,
                                  }),
                              )
                            }

                            const strTmp: any = []
                            arrHour.forEach(item =>
                              strTmp.push(
                                ` ${convertTimeToHHmm(item.workTimeFrom)} - ${convertTimeToHHmm(
                                  item.workTimeTo,
                                )}`,
                              ),
                            )

                            workSchedule.push(`${strTmp} | ${workDay}`)

                            return workSchedule
                          }

                          const obj = {
                            isActive, ownPost, title, id, workingAddress, wageMax, wageMin, wageUnit, matching, isHotJob, applyingStatus, distance,
                            userId: user.id, isSaveJob: isSavedJob, isUrgent: urgent, schedule: renderSchedule(), expiredDate: canApplyDate,
                          }
                          return <Col key={i}
                            xs={router.query.jobId ? 24 : 24}
                            md={router.query.jobId ? 24 : 12}
                          >
                            <div className={styles.content}>
                              <div className={styles.content_item}>
                                <Job
                                 {...obj} 
                                 onHandleClickJob={() => changeRoutePreviewJob(job)}
                                 handleClickSave={handleClickSave} />
                              </div>
                            </div>
                          </Col>
                        })
                      }
                    </Row>
                    <div className={styles.job_main_content_pagi}>
                      {jobs
                        ?
                        <Pagination
                          pageSize={configConstant.limit.jobs}
                          total={jobs?.meta?.pagination?.total}
                          current={jobs?.meta?.pagination?.currentPage}
                          onChange={onChangePagi}
                          className={styles.candidate_pagi}
                          hideOnSinglePage
                        />
                        : null}
                    </div>
                  </Col>
                  <>
                    {
                      !!router.query.jobId && !!Object.keys(dataJobPreview).length &&
                      <Col xs={24} md={12} className='pl-3' >
                        {
                          loadingPreview ?
                            <>
                              <Skeleton active className='p-4' />
                              <Skeleton active className='p-4 mt-2' />
                            </>
                            :
                            <div className='bg-white' style={{ maxHeight: "735px", overflow: "auto" }}>
                              <JobDetailPage
                                dataSSR={dataJobPreview}
                                changeDataSSR={(data) => setDataJobPreview(data)}
                              />
                            </div>
                        }
                      </Col>
                    }
                  </>
                </Row>
            }
          </div>
        </Form>
      </div>
      <div className='py-3 bg-white' >
        <OutstandingProfessions styled={{ maxWidth: "1280px", margin: "auto" }} />
      </div>
    </>
  )
}

export async function getServerSideProps(ctx) {
  setUserRoleCookieSSR({ ctx, role: roleConstant.EE.key })
  return { props: {} }
}
