/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */

import { configConstant } from 'src/constants/configConstant'
import Companies from './Companies'
import Addresses from './CompanyAddresses'
import Educations from './Educations'
import Experiences from './Experiences'
import ProSkills from './ProSkills'
import UserServices from './UserServices'


/* eslint-disable lines-between-class-members */
export default class User {
  id: number | undefined = undefined;
  code: string = "";
  catId: number | undefined = undefined;
  phoneNumber: string = "";
  email: string = "";
  name: string = "";
  displayName?: string = "";
  gender: number | undefined = undefined;
  language: string = "";
  birthday: string = "";
  avatar = configConstant.defaultAvatar;
  companyId?: number | undefined = undefined;
  academicId?: number | undefined = undefined;
  addressFull?: string = "";
  isEmployee?: boolean = true;
  isEmployer?: boolean = false;
  isPersonal?: boolean = true;
  verifyKyc?: number = 0;
  verifyOption_1?: string = "";
  verifyOption_2?: string = "";
  points?: number = 0;
  expectSalaryFrom?: number | undefined = undefined;
  expectSalaryHourlyFrom?: number | undefined = undefined;
  expectSalaryHourlyTo?: number | undefined = undefined;
  expectSalaryTo?: number | undefined = undefined;
  expectSalaryUnit?: number = 1;
  favCats?: Array<number> | undefined = undefined;
  status?: number = 0;
  verifyOption1?: string = "";
  verifyOption2?: string = "";
  mainAddressId?: number = 54;
  shortAddress?: string = "Quận Hà Đông; Thành phố Hà Nội";
  canviewDetailProfile?: boolean = true;
  experiences?: Array<Experiences> | undefined = undefined;
  profSkills?: Array<ProSkills> | undefined = undefined;
  educations?: Array<Educations> | undefined = undefined;
  companyList?: Array<Companies> | undefined = undefined;
  addresses?: Array<Addresses> | undefined = undefined;
  walletValue?: number = 0;
  userServices?: Array<UserServices> | undefined = undefined;
  vipInfo?= {};
  userRating?: number = 5;
}


export const UserListSchema = {
  data: {
    type: "array", items: {
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
        userRating: { type: "number", optional: true },
        //
        phoneNumber: { type: "string", optional: true },
        email: { type: "string", optional: true },
        status: { type: "number", optional: true },
        verifyOption1: { type: "string", optional: true },
        verifyOption2: { type: "string", optional: true },
        expectSalaryFrom: { type: "number", optional: true },
        expectSalaryTo: { type: "number", optional: true },
        expectSalaryUnit: { type: "number", optional: true },
        expectSalaryHourlyFrom: { type: "number", optional: true },
        expectSalaryHourlyTo: { type: "number", optional: true },
        canviewDetailProfile: { type: "boolean", optional: true },
        //
        addresses: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true, nullable: true },
              longitude: { type: "number", optional: true, nullable: true },
              latitude: { type: "number", optional: true, nullable: true },
              address: { type: "string", optional: true, nullable: true },
              provinceId: { type: "number", optional: true, nullable: true },
              districtId: { type: "number", optional: true, nullable: true },
              communeId: { type: "number", optional: true, nullable: true },
              userAddressId: { type: "number", optional: true, nullable: true },
              main: { type: "number", optional: true, nullable: true },
              createdAt: { type: "string", optional: true, nullable: true },
              updatedAt: { type: "string", optional: true, nullable: true },
            }
          }, optional: true, nullable: true,
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
              userId: { type: "number", optional: true, nullable: true },
              userRole: { type: "number", optional: true, nullable: true },
              createdAt: { type: "string", optional: true, nullable: true },
              updatedAt: { type: "string", optional: true, nullable: true },
            }
          }, optional: true, nullable: true
        },
        shouldShowAppReview: { type: "boolean", optional: true },
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
              createdAt: { type: "string", optional: true, nullable: true },
              updatedAt: { type: "string", optional: true, nullable: true },
            }
          }, optional: true
        },
        vipInfo: {
          type: "object", strict: true, props: {
            currentVipLevel: { type: "number", optional: true, nullable: true },
            nextVipLevel: {
              type: "object", strict: true, props: {
                id: { type: "number", optional: true, nullable: true },
                vipName: { type: "string", optional: true, nullable: true },
                point: { type: "number", optional: true, nullable: true },
                createdAt: { type: "string", optional: true, nullable: true },
                updatedAt: { type: "string", optional: true, nullable: true },
              },
              currentPoints: { type: "number", optional: true, nullable: true }
            }
          }, optional: true, nullable: true
        },
        walletValue: { type: "number", optional: true },
        //
        experiences:
        {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true },
              userId: { type: "number", optional: true },
              categoryId: { type: "number", optional: true },
              experienceId: { type: "number", optional: true },
              note: { type: "string", optional: true }
            }
          }, optional: true
        },
        profSkills:
        {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true },
              userId: { type: "number", optional: true },
              profSkillId: { type: "number", optional: true },
              experience: { type: "number", optional: true },
              note: { type: "string", optional: true },
              createdAt: { type: "string", optional: true },
              updatedAt: { type: "string", optional: true }

            }
          }, optional: true
        }
        ,
        favCats: "array|number|optional",
        educations: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true },
              userId: { type: "number", optional: true },
              schoolId: { type: "number", optional: true },
              degree: { type: "string", optional: true },
              major: { type: "string", optional: true },
              startDate: { type: "number", optional: true },
              endDate: { type: "number", optional: true },
              grade: { type: "number", optional: true },
              certificateImg: { type: "string", optional: true },
              otherDesc: { type: "string", optional: true },
              createdAt: { type: "string", optional: true },
              updatedAt: { type: "string", optional: true },
              name: { type: "string", optional: true },
              shortName: { type: "string", optional: true }
            },
          }, optional: true
        },
      }
    }
  }
}
export const UserSchema = {
  data: {
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
      userRating: { type: "number", optional: true },
      //
      phoneNumber: { type: "string", optional: true },
      email: { type: "string", optional: true },
      status: { type: "number", optional: true },
      verifyOption1: { type: "string", optional: true },
      verifyOption2: { type: "string", optional: true },
      expectSalaryFrom: { type: "number", optional: true },
      expectSalaryTo: { type: "number", optional: true },
      expectSalaryUnit: { type: "number", optional: true },
      expectSalaryHourlyFrom: { type: "number", optional: true },
      expectSalaryHourlyTo: { type: "number", optional: true },
      canviewDetailProfile: { type: "boolean", optional: true },
      //
      addresses: {
        type: "array", items: {
          type: "object", strict: true, props: {
            id: { type: "number", optional: true, nullable: true },
            longitude: { type: "number", optional: true, nullable: true },
            latitude: { type: "number", optional: true, nullable: true },
            address: { type: "string", optional: true, nullable: true },
            provinceId: { type: "number", optional: true, nullable: true },
            districtId: { type: "number", optional: true, nullable: true },
            communeId: { type: "number", optional: true, nullable: true },
            userAddressId: { type: "number", optional: true, nullable: true },
            main: { type: "number", optional: true, nullable: true },
            createdAt: { type: "string", optional: true, nullable: true },
            updatedAt: { type: "string", optional: true, nullable: true },
          }
        }, optional: true, nullable: true,
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
            userId: { type: "number", optional: true, nullable: true },
            userRole: { type: "number", optional: true, nullable: true },
            createdAt: { type: "string", optional: true, nullable: true },
            updatedAt: { type: "string", optional: true, nullable: true },
          }
        }, optional: true, nullable: true
      },
      shouldShowAppReview: { type: "boolean", optional: true },
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
            createdAt: { type: "string", optional: true, nullable: true },
            updatedAt: { type: "string", optional: true, nullable: true },
          }
        }, optional: true
      },
      vipInfo: {
        type: "object", strict: true, props: {
          currentVipLevel: { type: "number", optional: true, nullable: true },
          nextVipLevel: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true, nullable: true },
              vipName: { type: "string", optional: true, nullable: true },
              point: { type: "number", optional: true, nullable: true },
              createdAt: { type: "string", optional: true, nullable: true },
              updatedAt: { type: "string", optional: true, nullable: true },
            },
            currentPoints: { type: "number", optional: true, nullable: true }
          }
        }, optional: true, nullable: true
      },
      walletValue: { type: "number", optional: true },
      //
      experiences:
      {
        type: "array", items: {
          type: "object", strict: true, props: {
            id: { type: "number", optional: true },
            userId: { type: "number", optional: true },
            categoryId: { type: "number", optional: true },
            experienceId: { type: "number", optional: true },
            note: { type: "string", optional: true }
          }
        }, optional: true
      },
      profSkills:
      {
        type: "array", items: {
          type: "object", strict: true, props: {
            id: { type: "number", optional: true },
            userId: { type: "number", optional: true },
            profSkillId: { type: "number", optional: true },
            experience: { type: "number", optional: true },
            note: { type: "string", optional: true },
            createdAt: { type: "string", optional: true },
            updatedAt: { type: "string", optional: true }

          }
        }, optional: true
      }
      ,
      favCats: "array|number|optional",
      educations: {
        type: "array", items: {
          type: "object", strict: true, props: {
            id: { type: "number", optional: true },
            userId: { type: "number", optional: true },
            schoolId: { type: "number", optional: true },
            degree: { type: "string", optional: true },
            major: { type: "string", optional: true },
            startDate: { type: "number", optional: true },
            endDate: { type: "number", optional: true },
            grade: { type: "number", optional: true },
            certificateImg: { type: "string", optional: true },
            otherDesc: { type: "string", optional: true },
            createdAt: { type: "string", optional: true },
            updatedAt: { type: "string", optional: true },
            name: { type: "string", optional: true },
            shortName: { type: "string", optional: true }
          },
        }, optional: true
      },
    }, optional: true
  },
}

