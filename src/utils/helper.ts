/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-nested-ternary */

import { message } from 'antd'
import i18next from 'i18next'
import { Base64 } from 'js-base64'
import { configConstant } from 'src/constants/configConstant'
import { errorCodeConstant } from 'src/constants/errorCodeConstant'
import { infoUserStatus } from 'src/constants/statusConstant'

import * as Sentry from '@sentry/nextjs'

import { getAccessTokenCookieCSR } from './storage'

const toStandard = (phone: string) => {
  if ((phone.length === 10 || phone.length === 11) && phone[0] === "0") {
    return `84${phone}`.replace(/840/g, "84");
  }
  let p = phone;
  if (p[0] === "0") {
    p = p.replace(/084/g, "84");
  }

  if (p[2] === "0") {
    p = p.replace(/840/g, "84");
  }
  return p;
}

export const checkPhoneNumber = (str: string): string | null => {
  const phone = str.replace(/[^0-9]/g, "");

  // Check mobile phone
  const isPhone = /^($|(084|84|))(0?[3|5|7|8|9])([0-9]{8})\b/g.test(phone)

  // Check home phone
  const isHomePhone = /^($|(084|84|))(0?2)([0-9]{9})\b/g.test(phone)

  if (isPhone || isHomePhone) {
    return toStandard(phone)
  }

  return null
}

//  check role
export const isEmployee = (profile: UserGlobal.Profile): boolean => {
  if (profile.isEmployee) {
    return true
  }
  return false
}
export const isEmployer = (profile: UserGlobal.Profile): boolean => {
  if (profile.isEmployer) {
    return true
  }
  return false
}
export const isUser = (profile: UserGlobal.Profile): boolean => {
  if (profile.isEmployee || profile.isEmployer) {
    return true
  }
  return false
}

// Create category
interface ICateInput {
  id: number
  name: string
  parentId?: number
  children: ICateInput[]
}

interface ICateOutput {
  value: number
  label: string
  children?: ICateOutput[]
}

interface ILoca {
  value: number
  label: string
  children?: ILoca[]
}

export function createCategories(categories = <any>[], parentId = 0) {
  const categoryList: any = []
  let category

  if (parentId === 0) {
    category = categories.filter(cat => cat.parentId === 0)
  } else {
    category = categories.filter(cat => cat.parentId === parentId)
  }

  category.forEach((cate) => {
    if (parentId === 0)
      categoryList.push({
        value: cate.id,
        label: cate.name,
        children: createCategories(categories, cate.id),
      })
    else
      categoryList.push({
        value: cate.id,
        label: cate.name,
      })
  })

  return categoryList
}

// format location: province -> district
export function formatLocation(provinces, districts): ILoca[] {
  const locationList: ILoca[] = []

  const handleDistrict = id => {
    const arr: ILoca[] = []
    districts.forEach(district => {
      if (id === district.provinceId) arr.push({ value: district.id, label: district.name })
    })
    return arr
  }

  provinces.forEach(province =>
    locationList.push({
      value: province.id,
      label: province.name,
      children: handleDistrict(province.id),
    }),
  )

  return locationList
}

// query string
interface queryString {
  [k: string]: string
}

export const getQueryString = () => {
  // if (typeof window !== 'undefined') {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  return params
  // }
  // return
}



export const formatDiamond = (value): string =>
  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : "0"


export const formatNumber = (value): string =>
  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')



export const parseNumber = (value:any): string => value?.replace(/\$\s?|(,*)/g, '')


export const convertToHumanDate = (timestamp: number): string => {
  const fullTime = new Date(timestamp * 1000)
  const year = fullTime.getFullYear()
  const month = `0${fullTime.getMonth() + 1}`.slice(-2)
  const date = `0${fullTime.getDate()}`.slice(-2)
  return `${date}/${month}/${year}`
}

// Xóa dấu các tất cả các từ tiếng việt
export function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const filterSelectOption = (input: string, option: any): boolean =>
  removeAccents(option?.children?.toLowerCase()).indexOf(removeAccents(input.toLowerCase())) >= 0

export const filterSortSelectOption = (optionA, optionB): any => {
  if (optionA.children && optionB.children)
    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
}


export const getTokenUser = () => {
  let token
  try {
    const encodedAccessToken = getAccessTokenCookieCSR()
    if (encodedAccessToken) {
      token = Base64.decode(encodedAccessToken)
    }
  } catch (e) {
    return null
  }
  return token
}

export const getErrorText = (error: any) => error.response?.data?.message || i18next.t('error.unknown')


interface IHandleError {
  isIgnoredMessage?: boolean
  showNotFoundMessage?: boolean
  callback?: () => void
}

export const handleError = (error, options: IHandleError = {}): void => {
  if (typeof error === "string") {
    message.error(error);
  }



  const errorDetail: ErrorResponseApi = error.response?.data || {};

  if (process.env.NODE_ENV === configConstant.environment.development) {
    console.error(error);
  }
  // push message error to sentry
  if (errorDetail.errorCode !== errorCodeConstant.errorNoData) {
    Sentry.captureMessage(errorDetail.message, { level: Sentry.Severity.Error });
  }

  // if (error.response.data.errorCode === 9000) {
  //   // return console.error((error as ErrorMsg).response.data.message)
  //   return alert("ádasdas")
  // }

  if (
    (!options?.isIgnoredMessage && errorDetail.errorCode !== errorCodeConstant.errorNoData)
    || (options?.showNotFoundMessage && errorDetail.errorCode === errorCodeConstant.errorNoData)
  ) {
    message.error(getErrorText(error))
  }
  if (options?.callback) {
    options.callback()
  }
}

// interface handleError {
//   isShowMessage?: boolean
//   showNotFoundMessage?: boolean
//   callback?: () => void
// }

// export const handleErrorNew = ({ text, error, options = {} }
//   : { text?: string, error?: any, options?: handleError }): void => {

//   if (text) {
//     message.error(text);
//   }

//   if (process.env.NODE_ENV === configConstant.environment.development) {
//     console.error(error);
//   }

//   if (error) {
//     const errorDetail = error.response.data || {};

//     // push message error to sentry
//     if (errorDetail.errorCode !== errorCodeConstant.errorNoData) {
//       Sentry.captureMessage(errorDetail.message, { level: Sentry.Severity.Error });
//     }

//     if (
//       (!options.isShowMessage && errorDetail.errorCode !== errorCodeConstant.errorNoData)
//       || (options.showNotFoundMessage && errorDetail.errorCode === errorCodeConstant.errorNoData)
//     ) message.error(getErrorText(error))

//   }

//   if (options?.callback) {
//     options.callback()
//   }
// }

export const scrollToTop = (): void => {
  // document.body.scrollTop = 0 // For Safari
  // document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // for smoothly scrolling
  });
}

export const scrollToTopForSection = (dom): void => {
  dom?.scrollTo(0, 0)
}

export const calcTranslateX = (width, tab) => {
  if (!width) {
    return tab * 560;
  }
  if (width >= 1200) {
    return tab * 560;
  }
  return tab * (width * 560 / 1200)
}

export const calcWidthTranslateX = (width) => {
  if (!width) {
    return 560;
  }
  if (width >= 1200) {
    return 560;
  }

  return width * 560 / 1200
}





export const convertTimeToHHmm = date => {
  const arrNum = date.toString().split('.')
  return `${String(arrNum[0]).padStart(2, '0')}:${String(
    (Number(arrNum[1]) * 0.6).toFixed(),
  ).padStart(2, '0')}`
}

export const transformTextLocation = location =>
  location.replace('Quận', '').replace('Huyện', '').replace('Thành phố', '').replace('Tỉnh', '')

export const transformQueryToStr = object => {
  let tmpStr = ''

  Object.keys(object).forEach(key => {
    switch (key) {
      case "male":
        tmpStr = tmpStr.concat('&genders=1');
        break;
      case "female":
        tmpStr = tmpStr.concat('&genders=2');
        break;
      case "other":
        tmpStr = tmpStr.concat('&genders=0');
        break;

      default:
        tmpStr = tmpStr.concat(`&${key}=${object[key]}`);
    }
  })

  return tmpStr.replace(tmpStr[0], '?')
}
export const newWindowPopupCenter = ({ url, title, w, h }) => {
  // Fixes dual-screen position
  if (typeof window !== 'undefined') {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height

    const systemZoom = width / window.screen.availWidth
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
    window.open(
      url,
      title,
      `
      scrollbars=yes,
      width=${w / systemZoom},
      height=${h / systemZoom},
      top=${top},
      left=${left}
      `,
    )
  }
}


export const getMobileOperatingSystem = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

  // Windows Phone must come first because its UA also contains "Android"
  // if (/windows phone/i.test(userAgent)) {
  //   return 'Windows Phone'
  // }

  if (/android/i.test(userAgent)) {
    return configConstant.mobileOS.android.key
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return configConstant.mobileOS.iOS.key
  }

  return 'unknown'
}



export const isFunction = (functionToCheck) => functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'

export const isServer = () => typeof window === 'undefined';

export const convertParamsSearch = (search) => JSON.parse(`{"${decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)

export const dectectDeviceType = () => {
  let check = false;
  if (!isServer()) {
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
  }
  return check ? configConstant.device.mobile : configConstant.device.desktop;
}

export const isPositiveInteger = (value) => {
  const num = Number(value);

  if (Number.isInteger(num) && num >= 0) {
    return true;
  }

  return false;
}
export const convertArrayToObjectData = (array, key) => array.reduce((total: any, currentValue) => ({
  ...total,
  [currentValue[key]]: currentValue
}), {})

export const convertObjectToArraytData = (obj) => Object.keys(obj).map(item => obj[item]);

export const getObjectOfArray = (value, keyObject, array) => array.find(item => item[keyObject] === value ) || {}

export const checkCompleteInfo = (profile) => {
  const { name, phoneNumber, birthday, gender, addresses,
    academicId, favCats, profSkills, expectSalaryFrom, expectSalaryTo, hasExperience } = profile

  if (name && phoneNumber && birthday && addresses?.length && typeof gender === 'number'
    && academicId && favCats?.length && profSkills?.length && expectSalaryFrom && expectSalaryTo && typeof hasExperience === 'number')
    return infoUserStatus.full;
  if (name && phoneNumber && birthday && addresses?.length && typeof gender === 'number')
    return infoUserStatus.infoAcc;
  if (academicId && favCats?.length && profSkills?.length && expectSalaryFrom && expectSalaryTo && typeof hasExperience === 'number')
    return infoUserStatus.cv
  return infoUserStatus.nothing;
}
