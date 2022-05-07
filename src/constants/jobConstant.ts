const jobConstant = {
  jobType: {
    short: {
      key: 1,
      value: 'Ngắn hạn',
    },
    long: {
      key: 2,
      value: 'Dài hạn',
    },
  },
  recruit: {
    person: {
      key: 1,
      value: 'Cá nhân',
    },
    company: {
      key: 2,
      value: 'Công ty',
    },
  },
  userRole: {
    admin: 1,
    staff: 2,
  },
  calendarType: {
    hour: {
      key: 1,
      value: 'Theo giờ',
    },
    shift: {
      key: 2,
      value: 'Theo ca',
    },
  },
  salaryType: {
    deal: {
      key: 1,
      value: 'Thoả thuận',
    },
    range: {
      key: 2,
      value: 'Khoảng lương',
    },
  },
  genderType: {
    notRequire: {
      key: 1,
      value: 'Không yêu cầu',
    },
    chooseGender: {
      key: 2,
      value: 'Chọn giới tính',
    },
  },
  genderName: {
    male: {
      key: 1,
      value: "Nam"
    },
    female: {
      key: 2,
      value: "Nữ"
    },
    other: {
      key: 0,
      value: "Khác"
    },
  },
  ageType: {
    notRequire: {
      key: 1,
      value: 'Không yêu cầu',
    },
    chooseAge: {
      key: 2,
      value: 'Chọn độ tuổi',
    },
  },
  stepPost: {
    step1: 0,
    step2: 1,
    step3: 2,
    step4: 3,
  },
  statusContact: {
    none: 0,
    message: 2,
    call: 3,
  },
  rangeSalary: [
    {
      key: 0,
      text: "Duới 3 Tr/Tháng",
      value: [1, 2999999]
    },
    {
      key: 1,
      text: "Từ 3 - 5 Tr/Tháng",
      value: [3000000, 5000000]
    },
    {
      key: 2,
      text: "Từ 5 - 7 Tr/Tháng",
      value: [5000000, 7000000]
    },
    {
      key: 3,
      text: "Từ 7 - 10 Tr/Tháng",
      value: [7000000, 10000000]
    },
    {
      key: 4,
      text: "Từ 10 - 12 Tr/Tháng",
      value: [10000000, 12000000]
    },
    {
      key: 5,
      text: "Từ 12 - 15 Tr/Tháng",
      value: [12000000, 15000000]
    },
    {
      key: 6,
      text: "Từ 15 - 20 Tr/Tháng",
      value: [15000000, 20000000]
    },
    {
      key: 7,
      text: "Từ 25 - 30 Tr/Tháng",
      value: [25000000, 30000000]
    },
    {
      key: 8,
      text: "Trên 30 Tr/Tháng",
      value: [30000000, 1000000000]
    },
    {
      key: 9,
      text: "Thỏa thuận",
      value: []
    }

  ],
  typesOfWork: [
    {
      key: 1,
      text: "Ngắn hạn" 
      
    },
    {
      key: 2,
      text: "Dài hạn" 
    }
  ],
  wageUnit: {
    once: {
      id: 0,
      name: 'Một lần'
    },
    hours: {
      id: 1,
      name: 'Giờ'
    },
    shift: {
      id: 2,
      name: 'Ca'
    },
    day: {
      id: 3,
      name: 'Ngày'
    },
    week: {
      id: 4,
      name: 'Tuần'
    },
    month: {
      id: 5,
      name: 'Tháng'
    }
  },
}

export default jobConstant
