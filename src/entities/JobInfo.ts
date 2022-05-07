/* eslint-disable @typescript-eslint/no-inferrable-types */

export default class JobInfo {
  userId: number = 10;

  companyId: number = 12;

  jobStatus: number = 1;

  title: string = "Cần tuyển ReacTjs";

  jobType: number = 0;

  workingAddress: string = "";

  wokingShortTimeFrom: number = 1623012141;

  wokingShortTimeTo: number = 1623012199;

  wageMin: number = 1;

  wageMax: number = 500000;

  wageUnit: number = 1;

  hiringCount: number = 1;

  startTime: number = 1623012141;

  expireTime: number = 1623012141;

  genders: number = 0;

  jobSchedules = {
    dayOfWeek: 1,
    workingShift: 1,
    workTimeFrom: 34343,
    workTimeTo: 3434434
  };

  jobPostCategoryIds = [
    1
  ];

  jobPostExpRequiredCateIds = [
    1
  ];

  benefitIds: number = 0;

  experienceId: number = 0;

  ageFrom: number = 0;

  ageTo: number = 0;

  educationLevel: number = 1;

  detailDesc: string = "Desc";
}
/*
{"acceptedCount": 46, "addressId": null, "ageFrom": 0, "ageTo": 10, "appliedCount": 15,
"benefitIds": [3, 1, 2, 3],
"company": {"avatar": null, "contactPhone": "1232343", "desc": "description text", "id": 1, "industryId": 1, "isVerified": 1, "name": "company1", "numEmployee": 100, "parentId": 0, "website": "http"},
"companyId": 1, "createdAt": "2021-06-18T02:33:52.000Z",
"detailDesc": "", "educationLevel": 1, "experienceId": 1,
"expireTime": 1622103864, "genders": [], "hiringCount": 3,
"id": 2,
"jobPostCategoryIds": [1],
"jobPostExpRequiredCateIds": [2],
"jobSchedules": [],
"jobStatus": 0, "jobType": 2,
"matching": 12,
"startTime": 1622103964,
"title": "Tuyển nhân viên bưng bê", "updatedAt": "2021-06-18T02:33:52.000Z",
"urgent": 0,
"user": {"avatar": "", "birthday": null, "code": "BXoePP96lpx", "email": "", "gender": 0, "id": 8, "isEmployee": 0, "isEmployer": 0, "isPersonal": 1, "language": "vi", "name": "", "phoneNumber": "84947471268", "shortAddress": "Quận Đống Đa, Hà Nội"},
"userId": 8, "viewCount": 10, "wageMax": 0, "wageMin": 0, "wageUnit": 1, "wokingShortTimeFrom": null, "wokingShortTimeTo": null, "workingAddress": ""}
*/
export const JobsSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true },
        jobId: { type: "number", optional: true },
        userId: { type: "number", optional: true },
        userIdChange: { type: "number", optional: true },
        companyId: { type: "number", optional: true },
        jobStatus: { type: "number", optional: true },
        title: { type: "string", max: 150, optional: true },
        jobType: { type: "number", optional: true },
        keyword: { type: "string", optional: true },
        workingAddress: { type: "string", max: 150, optional: true },
        wokingShortTimeFrom: { type: "number", optional: true },
        wokingShortTimeTo: { type: "number", optional: true },
        wageMin: { type: "number", optional: true },
        wageMax: { type: "number", optional: true },
        wageUnit: { type: "number", optional: true },
        hiringCount: { type: "number", optional: true },
        startTime: { type: "number", optional: true },
        expireTime: { type: "number", optional: true },
        genders: "array|number|optional",
        jobSchedules: {
          type: "array", items: {
            type: "object", strict: true, props: {
              dayOfWeek: { type: "number", optional: true },
              shiftId: { type: "number", optional: true },
              workTimeFrom: { type: "string", optional: true },
              workTimeTo: { type: "string", optional: true }
            }
          }, optional: true
        },
        jobPostCategoryIds: "array|number|optional",
        jobPostExpRequiredCateIds: "array|number|optional",
        benefitIds: "array|number|optional",
        experienceId: { type: "number", optional: true },
        ageFrom: { type: "number", optional: true },
        ageTo: { type: "number", optional: true },
        educationLevel: { type: "number", optional: true },
        detailDesc: { type: "string", optional: true },
        //
        oldStatus: { type: "number", optional: true },
        newStatus: { type: "number", optional: true },
        reasonChangeStatusOld: { type: "string", max: 150, optional: true },
        reasonChangeStatusNew: { type: "string", max: 150, optional: true },
        //
        createdAt: { type: "string", optional: true },
        updatedAt: { type: "string", optional: true },
        //
        appliedTime: { type: "number", optional: true },
        respondedTime: { type: "number", optional: true },
        hiringStatus: { type: "number", optional: true },
        jobReasonId: { type: "number", optional: true },
        addressId: { type: "number", optional: true },
        urgent: { type: "number", optional: true },
        viewCount: { type: "number", optional: true },
        appliedCount: { type: "number", optional: true },
        acceptedCount: { type: "number", optional: true },
        methodReceiveNotify: { type: "number", optional: true },
        canApplyDate: { type: "number", optional: true },
        workingTime: { type: "number", optional: true },
        workingDay: { type: "number", optional: true },
        workingTimeCount: { type: "number", optional: true },
        workingDayCount: { type: "number", optional: true },
        imageUrl: { type: "string", max: 250, optional: true },
        videoUrl: { type: "string", max: 250, optional: true },
        otherDesc: { type: "string", optional: true },
        adddress: {
          type: "object", strict: true, props: {
            address: { type: "string", optional: true },
            latitude: { type: "number", optional: true },
            longitude: { type: "number", optional: true }
          }, optional: true
        },
        user: {
          type: "object", strict: true, props: {
            id: { type: "number", optional: true },
            code: { type: "string", optional: true },
            name: { type: "string", optional: true },
            gender: { type: "number", optional: true },
            language: { type: "string", optional: true },
            birthday: { type: "string", optional: true },
            avatar: { type: "string", optional: true },
            academicId: { type: "number", optional: true },
            isEmployee: { type: "number", optional: true },
            isEmployer: { type: "number", optional: true },
            isPersonal: { type: "number", optional: true },
            verifyKyc: { type: "number", optional: true },
            companyId: { type: "number", optional: true },
            points: { type: "number", optional: true },
            mainAddressId: { type: "number", optional: true },
            verifyEmail: { type: "number", optional: true },
            shortAddress: { type: "string", optional: true },
            experience: "array|number|optional",
            userRating: { type: "number", optional: true }
          }, optional: true
        },
        matching: { type: "number", optional: true },
        userSavedJobId: { type: "number", optional: true },
        isHotJob: { type: "number", optional: true },
        isSavedJob: { type: "number", optional: true },
        serviceList:
        {
          type: "array", items: {
            type: "object", strict: true, props: {
              fjob_service_code: { type: "string", optional: true },
              jobId: { type: "number", optional: true },
              serviceTypeId: { type: "number", optional: true },
              serviceName: { type: "string", optional: true },
              priceUnit: { type: "number", optional: true },
              serviceId: { type: "number", optional: true },
              quantity: { type: "number", optional: true },
            }
          }, optional: true
        },
        distance: { type: "number", optional: true },
        applyingStatus: { type: "number", optional: true },
        reasonChangeStatus: { type: "string", optional: true },
        job: {
          type: "object", strict: true, props: {
            addressId: { type: "number", optional: true },
            ageFrom: { type: "number", optional: true },
            ageTo: { type: "number", optional: true },
            canApplyDate: { type: "number", optional: true },
            distance: { type: "number", optional: true },
            educationLevel: { type: "number", optional: true },
            expireTime: { type: "number", optional: true },
            genders: "array|number|optional",
            id: { type: "number", optional: true },
            isHotJob: { type: "number", optional: true },
            isSavedJob: { type: "number", optional: true },
            jobPostCategoryIds: "array|number|optional",
            jobPostExpRequiredCateIds: "array|number|optional",
            jobSchedules: {
              type: "array", items: {
                type: "object", strict: true, props: {
                  dayOfWeek: { type: "number", optional: true },
                  shiftId: { type: "number", optional: true },
                  workTimeFrom: { type: "string", optional: true },
                  workTimeTo: { type: "string", optional: true }
                }
              }, optional: true
            },
            matching: { type: "number", optional: true },
            title: { type: "string", optional: true },
            urgent: { type: "number", optional: true },
            userPostJob: {
              type: "object", strict: true, props: {
                id: { type: "number", optional: true },
                name: { type: "string", optional: true },
                avatar: { type: "string", optional: true }
              }
            },
            wageMax: { type: "number", optional: true },
            wageMin: { type: "number", optional: true },
            wageUnit: { type: "number", optional: true },
            wokingShortTimeFrom: { type: "number", optional: true },
            wokingShortTimeTo: { type: "number", optional: true },
            workingAddress: { type: "string", optional: true },
          }, optional: true
        },
        company: { type: "object", optional: true }
      }
    }
  },
}
export const JobsDetailSchema = {
  data: {
    type: "object", strict: true, props: {
      id: { type: "number", optional: true },
      jobId: { type: "number", optional: true },
      userId: { type: "number", optional: true },
      userIdChange: { type: "number", optional: true },
      companyId: { type: "number", optional: true },
      jobStatus: { type: "number", optional: true },
      title: { type: "string", max: 150, optional: true },
      jobType: { type: "number", optional: true },
      keyword: { type: "string", optional: true },
      workingAddress: { type: "string", max: 150, optional: true },
      wokingShortTimeFrom: { type: "number", optional: true },
      wokingShortTimeTo: { type: "number", optional: true },
      wageMin: { type: "number", optional: true },
      wageMax: { type: "number", optional: true },
      wageUnit: { type: "number", optional: true },
      hiringCount: { type: "number", optional: true },
      startTime: { type: "number", optional: true },
      expireTime: { type: "number", optional: true },
      genders: "array|number|optional",
      jobSchedules: {
        type: "array", items: {
          type: "object", strict: true, props: {
            dayOfWeek: { type: "number", optional: true },
            shiftId: { type: "number", optional: true },
            workTimeFrom: { type: "string", optional: true },
            workTimeTo: { type: "string", optional: true }
          }
        }, optional: true
      },
      jobPostCategoryIds: "array|number|optional",
      jobPostExpRequiredCateIds: "array|number|optional",
      benefitIds: "array|number|optional",
      experienceId: { type: "number", optional: true },
      ageFrom: { type: "number", optional: true },
      ageTo: { type: "number", optional: true },
      educationLevel: { type: "number", optional: true },
      detailDesc: { type: "string", optional: true },
      //
      oldStatus: { type: "number", optional: true },
      newStatus: { type: "number", optional: true },
      reasonChangeStatusOld: { type: "string", max: 150, optional: true },
      reasonChangeStatusNew: { type: "string", max: 150, optional: true },
      //
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
      //
      appliedTime: { type: "number", optional: true },
      respondedTime: { type: "number", optional: true },
      hiringStatus: { type: "number", optional: true },
      jobReasonId: { type: "number", optional: true },
      addressId: { type: "number", optional: true },
      urgent: { type: "number", optional: true },
      viewCount: { type: "number", optional: true },
      appliedCount: { type: "number", optional: true },
      acceptedCount: { type: "number", optional: true },
      methodReceiveNotify: { type: "number", optional: true },
      canApplyDate: { type: "number", optional: true },
      workingTime: { type: "number", optional: true },
      workingDay: { type: "number", optional: true },
      workingTimeCount: { type: "number", optional: true },
      workingDayCount: { type: "number", optional: true },
      imageUrl: { type: "string", max: 250, optional: true },
      videoUrl: { type: "string", max: 250, optional: true },
      otherDesc: { type: "string", optional: true },
      adddress: {
        type: "object", strict: true, props: {
          address: { type: "string", optional: true },
          latitude: { type: "number", optional: true },
          longitude: { type: "number", optional: true }
        }, optional: true
      },
      user: {
        type: "object", strict: true, props: {
          id: { type: "number", optional: true },
          code: { type: "string", optional: true },
          name: { type: "string", optional: true },
          gender: { type: "number", optional: true },
          language: { type: "string", optional: true },
          birthday: { type: "string", optional: true },
          avatar: { type: "string", optional: true },
          academicId: { type: "number", optional: true },
          isEmployee: { type: "number", optional: true },
          isEmployer: { type: "number", optional: true },
          isPersonal: { type: "number", optional: true },
          verifyKyc: { type: "number", optional: true },
          companyId: { type: "number", optional: true },
          points: { type: "number", optional: true },
          mainAddressId: { type: "number", optional: true },
          verifyEmail: { type: "number", optional: true },
          shortAddress: { type: "string", optional: true },
          experience: "array|number|optional",
          userRating: { type: "number", optional: true }
        }, optional: true
      },
      matching: { type: "number", optional: true },
      userSavedJobId: { type: "number", optional: true },
      isHotJob: { type: "number", optional: true },
      isSavedJob: { type: "number", optional: true },
      serviceList:
      {
        type: "array", items: {
          type: "object", strict: true, props: {
            fjob_service_code: { type: "string", optional: true },
            jobId: { type: "number", optional: true },
            serviceTypeId: { type: "number", optional: true },
            serviceName: { type: "string", optional: true },
            priceUnit: { type: "number", optional: true },
            serviceId: { type: "number", optional: true },
            quantity: { type: "number", optional: true },
          }
        }, optional: true
      },
      distance: { type: "number", optional: true },
      applyingStatus: { type: "number", optional: true },
      reasonChangeStatus: { type: "string", optional: true },
      job: {
        type: "object", strict: true, props: {
          addressId: { type: "number", optional: true },
          ageFrom: { type: "number", optional: true },
          ageTo: { type: "number", optional: true },
          canApplyDate: { type: "number", optional: true },
          distance: { type: "number", optional: true },
          educationLevel: { type: "number", optional: true },
          expireTime: { type: "number", optional: true },
          genders: "array|number|optional",
          id: { type: "number", optional: true },
          isHotJob: { type: "number", optional: true },
          isSavedJob: { type: "number", optional: true },
          jobPostCategoryIds: "array|number|optional",
          jobPostExpRequiredCateIds: "array|number|optional",
          jobSchedules: {
            type: "array", items: {
              type: "object", strict: true, props: {
                dayOfWeek: { type: "number", optional: true },
                shiftId: { type: "number", optional: true },
                workTimeFrom: { type: "string", optional: true },
                workTimeTo: { type: "string", optional: true }
              }
            }, optional: true
          },
          matching: { type: "number", optional: true },
          title: { type: "string", optional: true },
          urgent: { type: "number", optional: true },
          userPostJob: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true },
              name: { type: "string", optional: true },
              avatar: { type: "string", optional: true }
            }
          },
          wageMax: { type: "number", optional: true },
          wageMin: { type: "number", optional: true },
          wageUnit: { type: "number", optional: true },
          wokingShortTimeFrom: { type: "number", optional: true },
          wokingShortTimeTo: { type: "number", optional: true },
          workingAddress: { type: "string", optional: true },
        }, optional: true
      },
      company: { type: "object", optional: true }
    }
  },
}

