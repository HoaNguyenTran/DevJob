export const UserDetailsSchema = {
  data: {

  }
}
export const UserGroupSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        academicId: {type: "number", optional: true},
        avatar: { type: "string", optional: true},
        birthday: { type: "string", optional: true},
        code: { type: "string", optional: true},
        companyId: {type: "number", optional: true},
        email: { type: "string", optional: true},
        expectSalaryFrom: {type: "number", optional: true},
        expectSalaryHourlyFrom: {type: "number", optional: true},
        expectSalaryHourlyTo: {type: "number", optional: true},
        expectSalaryTo: {type: "number", optional: true},
        expectSalaryUnit: {type: "number", optional: true},
        experiences: {
          type: "array", items: {
            type: "object", strict: true, props: {
              categoryId: { type: "number", optional: true},
              experienceId: { type: "number", optional: true},
              id: { type: "number", optional: true},
              note: { type: "string", optional: true},
              userId: { type: "number", optional: true},
            }
          }
        },
        favCats: "array|number|optional",
        gender: {type: "number", optional: true},
        groupId: {type: "number", optional: true},
        id: {type: "number", optional: true},
        isEmployee: {type: "number", optional: true},
        isEmployer: {type: "number", optional: true},
        isPersonal: {type: "number", optional: true},
        language: { type: "string", optional: true},
        mainAddressId: {type: "number", optional: true},
        name: { type: "string", optional: true},
        phoneNumber: { type: "string", optional: true},
        points: {type: "number", optional: true},
        profSkills: {
          type: "array", items: {
            type: "object", strict: true, props: {
              createdAt: { type: "string", optional: true},
              experience: { type: "number", optional: true},
              id: { type: "number", optional: true},
              note: { type: "string", optional: true},
              profSkillId: { type: "number", optional: true},
              updatedAt: { type: "string", optional: true},
              userId: { type: "number", optional: true}
            }
          }
        },
        shortAddress: { type: "string", optional: true},
        status: {type: "number", optional: true},
        userGroupId: {type: "number", optional: true},
        verifyEmail: {type: "number", optional: true},
        verifyKyc: {type: "number", optional: true},
        verifyOption1: { type: "string", optional: true},
        verifyOption2: { type: "string", optional: true},
      }
    }
  }
}
