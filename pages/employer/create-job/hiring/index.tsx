/* eslint-disable no-nested-ternary */
import { getDetailJobApi } from 'api/client/job'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import MainPostJob from 'src/components/modules/CreateJob/MainPostJob/MainPostJob'
import { configConstant } from 'src/constants/configConstant'
import { dayOfWeekConstant } from 'src/constants/dayOfWeekConstant'
import jobConstant from 'src/constants/jobConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { statusPostConstants } from 'src/constants/statusConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { handleError } from 'src/utils/helper'
import { setUserRoleCookieSSR } from 'src/utils/storage'

const dateFormat = 'DD/MM/YYYY'
const timeFormat = 'HH:mm'
const Hiring = (): JSX.Element => {
  const router = useRouter();
  
  const [initDataPostJob, setInitDataPostJob] = useState<any>({
    
  })
  
  const handleBindingTimeHHss = (timeStr = '') => {
    if (!timeStr) return '';
    const timeHours = Number(timeStr?.split(".")?.[0]);
    const timeSeconds = Number(timeStr?.split(".")?.[1]);
    const secondPerMinute = 60;
    return timeHours + (timeSeconds * secondPerMinute) / 10000;
  }
  const query: any = router.query || {};
  const formatDayOfWeek = (array) => {
    let dayOfWeek = array.reduce((total: any, currentValue) => {
      if (!total.includes(currentValue.dayOfWeek)) {
        total.push(currentValue.dayOfWeek)
      }
      return total
    }, [])
    
    dayOfWeek = dayOfWeek.filter(item => item === dayOfWeekConstant.allDay.key).length ? 
    [
      dayOfWeekConstant.allDay.key,
      dayOfWeekConstant.monday.key, 
      dayOfWeekConstant.tuesday.key, 
      dayOfWeekConstant.wednesday.key, 
      dayOfWeekConstant.thursday.key,
      dayOfWeekConstant.friday.key,
      dayOfWeekConstant.saturday.key,
      dayOfWeekConstant.sunday.key,
    ] 
     : dayOfWeek;
     return dayOfWeek
  }
  useEffect(() => {
    if (Object.keys(router.query).length) {
      (async () => {
        try {
          const { data } = await getDetailJobApi(query.id);
          let formData = {
            addressType: data.companyId ? jobConstant.recruit.company.key : jobConstant.recruit.person.key,
            jobTitle: data?.title || '',
            jobCate: data?.jobPostCategoryIds?.[0],
            hireCount: data?.hiringCount,
            jobType: data?.jobType,
            userAddress: data?.addressId,
            detailDesc: data?.detailDesc,
            companyId: data?.companyId,
            companyAddressId: data?.addressId,
            salaryType: data?.wageMin ? jobConstant.salaryType.range.key : jobConstant.salaryType.deal.key,
            salaryMax: data?.wageMax,
            salaryUnit: data?.wageUnit,
            dayOfWeek: formatDayOfWeek(data?.jobSchedules || []),
            uploadFile: [{
              url: data?.imageUrl,
            }],
            imageUrl: data?.imageUrl || "",
            calendarType: data?.jobSchedules?.[0]?.shiftId ? jobConstant.calendarType.shift.key : jobConstant.calendarType.hour.key,
            educationLevel: data?.educationLevel,
            experienceJob: data?.jobPostExpRequiredCateIds,
            benefitPolicy: data?.benefitIds as any,
            experienceTime: data.experienceId || 1, // default "khong yeu cau"
            moreRequire: data?.otherDesc,
            canCall: true,
            canMessage: true,
            workingDayNote: data?.workingDayNote,
            chooseGender: data.genders?.length ? data.genders : [],
            ageFrom: Number(data.ageFrom) ? (Number(data.ageFrom) <= configConstant.age.minAge ? undefined : Number(data.ageFrom)) : undefined,
            ageTo: Number(data.ageTo) ? (Number(data.ageTo) >= configConstant.age.maxAge ? undefined : Number(data.ageTo)): undefined,
          } as JobGlobal.JobValueForm
          
          if (formData.jobType === jobConstant.jobType.short.key) {
            formData = {
              ...formData,
              shortWorkTime: [moment(moment(data?.wokingShortTimeFrom * 1000).format(dateFormat), dateFormat),
              moment(moment(data?.wokingShortTimeTo * 1000).format(dateFormat), dateFormat)
              ],
            }
          }
          if (formData.calendarType === jobConstant.calendarType.hour.key) {
            formData = {
              ...formData,
              workHour: [
                moment(handleBindingTimeHHss(data?.jobSchedules[0]?.workTimeFrom as any).toString(), timeFormat),
                moment(handleBindingTimeHHss(data?.jobSchedules[0]?.workTimeTo as any).toString(), timeFormat)
              ],
            }
          } else {
            formData = {
              ...formData,
              workShift: data.jobSchedules?.[0]?.shiftId
                ? data.jobSchedules?.reduce((total: any, currentValue) => {
                  if (!total.includes(currentValue.shiftId)) {
                    total.push(currentValue.shiftId)
                  }
                  return total
                }, [])
                : [],
            }
          }

          if (formData.salaryType === jobConstant.salaryType.range.key) {
            formData = {
              ...formData,
              salaryMin: data?.wageMin,
              salaryMax: data?.wageMax,
            }
          }

          // if (formData.genderType === jobConstant.genderType.chooseGender.key) {
          //   formData = {
          //     ...formData,
          //     chooseGender: data.genders?.length ? data.genders : [],
          //   }
          // }
          // if (formData.ageType === jobConstant.ageType.chooseAge.key) {
          //   formData = {
          //     ...formData,
          //     ageFrom: Number(data.ageFrom) <= configConstant.age.minAge ? null : Number(data.ageFrom),
          //     ageTo: Number(data.ageTo) >= configConstant.age.maxAge? null : Number(data.ageTo),
          //   }
          // }
          if (query.isUpdating) {
            formData = {
              ...formData,
              timePostJob: moment(moment.unix(data?.startTime).format(dateFormat), dateFormat),
              deadlineSubmit: moment(moment.unix(data?.canApplyDate).format(dateFormat), dateFormat),
            }
          }
          if (data?.serviceList) {
            let services = data.serviceList;
            if (Number(query.jobStatus) !== statusPostConstants.Refuse) {
              services = [];
            }
            formData = {
              ...formData,
              useServices: services.map(item => ({
                code: item.fjob_service_code,
                id: item.jobId,
                name: item.serviceName,
                quantity: item.quantity,
                serviceId: item.serviceTypeId
              })),
            }
          }
          setInitDataPostJob(formData)
        } catch (err) {
          handleError(err);
        }
      })()
    } else {
      setInitDataPostJob({
        canCall: true,
        canMessage: true
      })
    }
  }, [])
  return <MainPostJob initDataPostJob={initDataPostJob} setInitDataPostJob= {setInitDataPostJob}/>
}

export default Hiring

export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies[storageConstant.cookie.accessToken]) {
    return {
      redirect: {
        destination: `${routerPathConstant.signIn}?next=${encodeURIComponent(ctx.req.url)}`,
        permanent: false,
      },
      props: {},
    }
  }

  setUserRoleCookieSSR({ ctx, role: roleConstant.ER.key })
  return {
    props: {},
  }
}