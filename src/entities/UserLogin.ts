/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable lines-between-class-members */
import User from './User'

export default class UserLogin {
  userCode: string = "";
  accessToken: string = "";
  firebaseToken: string = "";
  mqttToken: string = "";
  expiredAt: number = 1644550633271;
  refreshToken: string = "";
  trustedDevice: number = 0;
  user: User = new User();
}
export const UserLoginSchema = {
  data: {
    userCode: { type: "string", optional: true, nullable: true },
    accessToken: { type: "string", optional: true, nullable: true },
    firebaseToken: { type: "string", optional: true, nullable: true },
    mqttToken: { type: "string", optional: true, nullable: true },
    expiredAt: { type: "number", optional: true, nullable: true },
    refreshToken: { type: "string", optional: true, nullable: true },
    trustedDevice: { type: "number", optional: true, nullable: true },
    user: {
      type: "object", strict: true, props: {
        id: { type: "number", },
        code: { type: "string", max: 12 },
        catId: { type: "number", optional: true, nullable: true },
        phoneNumber: { type: "string", max: 50, optional: true, nullable: true },
        email: { type: "string", max: 100, optional: true, nullable: true, default: "" },
        name: { type: "string", max: 100, optional: true, nullable: true },
        displayName: { type: "string", max: 30, optional: true, nullable: true },
        gender: { type: "number", optional: true, nullable: true, default: 0 },
        language: { type: "string", max: 12, optional: true, nullable: true, default: "vi" },
        birthday: { type: "string", optional: true, nullable: true },
        avatar: { type: "string", max: 255, optional: true, nullable: true, default: "" },
        companyId: { type: "number", optional: true, nullable: true },
        academicId: { type: "number", optional: true, nullable: true },
        addressFull: { type: "string", max: 255, optional: true, nullable: true },
        isEmployee: "number|optional|nullable",
        isEmployer: "number|optional|nullable",
        isPersonal: "number|optional|nullable",
        verifyKyc: { type: "number", optional: true, nullable: true },
        verifyOption_1: { type: "string", max: 255, optional: true, nullable: true },
        verifyOption_2: { type: "string", max: 255, optional: true, nullable: true },
        points: { type: "number", optional: true, nullable: true, default: 0 },
        expectSalaryFrom: { type: "number", optional: true, nullable: true },
        expectSalaryHourlyFrom: { type: "number", optional: true, nullable: true },
        expectSalaryHourlyTo: { type: "number", optional: true, nullable: true },
        expectSalaryTo: { type: "number", optional: true, nullable: true },
        expectSalaryUnit: { type: "number", optional: true, nullable: true },
        favCats: "object|array|integer|min:0|optional|nullable",
        status: { type: "number", optional: true, nullable: true },
        verifyOption1: { type: "string", optional: true, nullable: true },
        verifyOption2: { type: "string", optional: true, nullable: true },
        mainAddressId: { type: "number", optional: true, nullable: true },
        shortAddress: { type: "string", optional: true, nullable: true },
        canviewDetailProfile: { type: "number", optional: true, nullable: true },
        experiences: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true, nullable: true },
              userId: { type: "number", optional: true, nullable: true },
              categoryId: { type: "number", optional: true, nullable: true },
              experienceId: { type: "number", optional: true, nullable: true },
              note: { type: "string", max: 200, optional: true, nullable: true },
              createdAt: { type: "date", optional: true, nullable: true },
              updatedAt: { type: "date", optional: true, nullable: true },
            }
          }, optional: true, nullable: true
        },
        profSkills: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true, nullable: true },
              userId: { type: "number", optional: true, nullable: true },
              profSkillId: { type: "number", optional: true, nullable: true },
              experience: { type: "number", optional: true, nullable: true },
              note: { type: "string", optional: true, nullable: true },
              createdAt: { type: "date", optional: true, nullable: true },
              updatedAt: { type: "date", optional: true, nullable: true },
            }
          }, optional: true, nullable: true
        },
        educations: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true, nullable: true },
              userId: { type: "number", optional: true, nullable: true },
              schoolId: { type: "number", optional: true, nullable: true },
              degree: { type: "string", max: 100, optional: true, nullable: true },
              major: { type: "string", max: 50, optional: true, nullable: true },
              startDate: { type: "number", optional: true, nullable: true },
              endDate: { type: "number", optional: true, nullable: true },
              grade: { type: "number", optional: true, nullable: true },
              certificateImg: { type: "string", max: 150, optional: true, nullable: true },
              otherDesc: { type: "string", max: 250, optional: true, nullable: true },
              createdAt: { type: "date", optional: true, nullable: true },
              updatedAt: { type: "date", optional: true, nullable: true },
              name: { type: "string", max: 250, optional: true, nullable: true },
              shortName: { type: "string", max: 250, optional: true, nullable: true },
              schoolType: { type: "number", optional: true, nullable: true },
            }
          }, optional: true, nullable: true
        },
        companyList: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", },
              name: { type: "string", max: 100, optional: true, nullable: true },
              contactPhone: { type: "string", max: 255, optional: true, nullable: true },
              website: { type: "string", max: 255, optional: true, nullable: true },
              numEmployee: { type: "number", optional: true, nullable: true },
              industryId: { type: "number", optional: true, nullable: true },
              desc: { type: "string", max: 255, optional: true, nullable: true },
              isVerified: { type: "number", optional: true, nullable: true },
              parentId: { type: "number", optional: true, nullable: true },
              avatar: { type: "string", max: 255, optional: true, nullable: true },
              status: { type: "number", optional: true, nullable: true },
              adminUserId: { type: "number", optional: true, nullable: true },
              shortName: { type: "string", max: 50, optional: true, nullable: true },
              imagesJson: { type: "string", optional: true, nullable: true },
              userId: { type: "number", optional: true, nullable: true, default: 0 },
              userRole: { type: "number", optional: true, nullable: true, default: 0 },
              createdAt: { type: "date", optional: true, nullable: true },
              updatedAt: { type: "date", optional: true, nullable: true },
            }
          }, optional: true, nullable: true
        },
        addresses: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true, nullable: true },
              longitude: { type: "number", optional: true, nullable: true },
              latitude: { type: "number", optional: true, nullable: true },
              address: { type: "number", optional: true, nullable: true },
              provinceId: { type: "number", optional: true, nullable: true },
              districtId: { type: "number", optional: true, nullable: true },
              communeId: { type: "number", optional: true, nullable: true },
              userAddressId: { type: "number", optional: true, nullable: true },
              main: { type: "number", optional: true, nullable: true },
              createdAt: { type: "date", optional: true, nullable: true },
              updatedAt: { type: "date", optional: true, nullable: true },
            }
          }
          , optional: true, nullable: true
        },
        walletValue: { type: "number", optional: true, nullable: true },
        userServices: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true, nullable: true },
              serviceTypeId: { type: "number", optional: true, nullable: true },
              code: { type: "string", max: 50, optional: true, nullable: true },
              name: { type: "string", max: 150, optional: true, nullable: true },
              desc: { type: "string", max: 250, optional: true, nullable: true },
              img: { type: "string", max: 250, optional: true, nullable: true },
              basePrice: { type: "number", optional: true, nullable: true },
              priceUnit: { type: "number", optional: true, nullable: true },
              quantity: { type: "number", optional: true, nullable: true },
              canBuy: { type: "number", optional: true, nullable: true },
              addition: { type: "string", max: 500, optional: true, nullable: true },
              createdAt: { type: "date", optional: true, nullable: true },
              updatedAt: { type: "date", optional: true, nullable: true },
            }
          }, optional: true, nullable: true
        },
        vipInfo: {
          type: "object", props: {
            currentVipLevel: null,
            nextVipLevel: {
              type: "object", strict: true, props: {

                type: "object", strict: true, props: {
                  id: { type: "number", optional: true, nullable: true },
                  vipName: { type: "string", optional: true, nullable: true },
                  point: { type: "number", optional: true, nullable: true },
                  createdAt: { type: "date", optional: true, nullable: true },
                  updatedAt: { type: "date", optional: true, nullable: true },
                }
              },
              currentPoints: { type: "number", optional: true, nullable: true }
            }
          }, optional: true, nullable: true
        },
        userRating: { type: "number", optional: true, nullable: true },

        createdAt: { type: "number", optional: true, nullable: true },
        updatedAt: { type: "number", optional: true, nullable: true },
        workingTime: { type: "number", optional: true, nullable: true },
        workingDay: { type: "number", optional: true, nullable: true },
        workingTimeCount: { type: "number", optional: true, nullable: true },
        workingDayCount: { type: "number", optional: true, nullable: true },
        verifyEmail: { type: "number", optional: true, nullable: true },
      }, optional: true, nullable: true
    },
  }
  // $$strict: true
}
