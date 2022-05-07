export const roleConstant = {
  guest: { id: 0, key: 'GUEST', name: 'guest' },
  EE: { id: 1, key: 'EE', name: 'employee' },
  ER: { id: 2, key: 'ER', name: 'employer' },
  user: { id: 3, key: 'USER', name: 'user' },
}

export const jobPostRole = {
  personal: 0,
  company: 1,
}
export enum userRoleInCompany {
  pending = 0,
  admin = 1,
  agent = 2
}
