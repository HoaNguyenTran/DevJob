export enum statusApplyConstants {
  NotApply = -1,
  Waiting = 0,
  Accept = 1,
  Reject = 2,
  Delete = 5,
  Saved = 8,
}

export enum statusPostConstants {
  Draft = 1,
  Waiting = 2,
  Posted = 3,
  Closed = 5,
  Expired = 4,
  Complete = 5,
  Delete = 6,
  Refuse = 7,
}

export enum CommonStatusConstant {
  Waiting = 0,
  Accept = 1,
  Reject = 2,
  Saved = 3,
  Cancel = 5,
}

export enum statusProgress {
  idle = 'idle',
  loading = 'loading',
  succeeded = 'succeeded',
  failed = 'failed',
}

export enum AccountRole {
  employee = 'employee',
  employer = 'employer',
  personal = 'personal',
  user = 'user',
  guest = 'guest',
}

export enum notificationStatus {
  unread = 0,
  read = 1,
  deleted = 2
}
export enum infoUserStatus {
  full = 3,
  infoAcc = 2,
  cv = 1,
  nothing = 0,
}

export enum TypeUnknownLink {
  comingSoon = 1,
  changePass = 2,
  logout = 3
}