export enum Gender {
  'Khác',
  'Nam',
  'Nữ',
}

export enum emailConfig {
  subject = "Fjob - hỗ trợ thắc mắc",
  emailSupport = "fjob.support@zetagroup.vn"
}

export enum UserRole {
  'Chờ duyệt',
  'Quản trị viên',
  'Thành viên'
}

export enum RedeemType {
  UserCode = 0,
  SaleRefCode = 1,
  Others = 2,
}

export const configConstant = {
  device: {
    desktop: "desktop",
    tablet: "tablet",
    mobile: "mobile",
  },
  limit: {
    blogs: 10,
    jobs: 10,
    notifications: 10
  },
  mobileOS: {
    android: {
      key: 'android',
      linkDownload: 'https://play.google.com/store/apps/details?id=vn.fjob.ee',
    },
    iOS: {
      key: 'iOS',
      linkDownload: 'https://apps.apple.com/us/app/fjob/id1591373758',
    },
  },

  mobileDomain: {
    Production: "fjob://",
    Staging: "fjobd://"
  },

  environment: {
    development: 'development',
    staging: 'staging',
    production: 'production',
  },

  prefixDomain: {
    main: "main",
    auth: "auth",
    mainDev: "main-api"
  },


  timeOTP: 90,



  numerology: {
    two: 'https://storage.googleapis.com/fjob-dev/a76f3a00-7dc0-11ec-be06-49a1df6a32da.png',
    three: 'https://storage.googleapis.com/fjob-dev/c3b33fe0-7dc0-11ec-be06-49a1df6a32da.png',
    four: 'https://storage.googleapis.com/fjob-dev/d7ded2e0-7dc0-11ec-be06-49a1df6a32da.png',
    five: 'https://storage.googleapis.com/fjob-dev/e4c102d0-7dc0-11ec-be06-49a1df6a32da.png',
    six: 'https://storage.googleapis.com/fjob-dev/ed07d8b0-7dc0-11ec-be06-49a1df6a32da.png',
    seven: 'https://storage.googleapis.com/fjob-dev/f45cfb90-7dc0-11ec-be06-49a1df6a32da.png',
    eight: 'https://storage.googleapis.com/fjob-dev/fc50cf70-7dc0-11ec-be06-49a1df6a32da.png',
    nine: 'https://storage.googleapis.com/fjob-dev/05339730-7dc1-11ec-be06-49a1df6a32da.png',
    ten: 'https://storage.googleapis.com/fjob-dev/114cd1d0-7dc1-11ec-be06-49a1df6a32da.png',
    eleven: 'https://storage.googleapis.com/fjob-dev/1bedc450-7dc1-11ec-be06-49a1df6a32da.png',
  },

  displayTime: {
    YYYYMMDD: "YYYY-MM-DD",
    YYYYMMDDHHmmss: "YYYY-MM-DD HH:mm:ss",
    MMDDYYYY: "MM-DD-YYYY",
    MMDDYYYYZ: "MM-DD-YYYY Z",
    DDMMYYY: "DD-MM-YYYY",
    DDMMYYYZ: "DD-MM-YYYY Z",
    DDMMYYYHHmm: "DD-MM-YYYY HH:mm",
    DDMMYYYHHmmss: "DD-MM-YYYY HH:mm:ss",
  },

  itemPerPage: {
    employee: 5,
    job: 10,
    
  },

  defaultAvatar: '/assets/images/avatar/user.png',
  defaultPicture:
    '/assets/images/avatar/company_fjob.svg',
  defaultCirclePicture:
    '/assets/images/avatar/company_circle_fjob.svg',

  mqttTopic: {
    topicUrgentPath: 'urgent_jobs',
    topicInAppNotificationPath: 'inapp_notification',
    topicInAppAllNotificationPath: 'send_all_inapp_notification'
  },

  timeoutUrgentPopup: 1000,
  maxLengthInput: 255,

  age: { minAge: 0, maxAge: 100 },
  gender: {
    other: { key: 0, text: "Khác" },
    male: { key: 1, text: "Nam" },
    female: { key: 2, text: "Nữ" }
  },

  domainStagingEnv: "https://api.dev.fjob.com.vn"
}
