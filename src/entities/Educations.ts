/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable lines-between-class-members */
export default class educations {
  id: string = "";
  userId: number = 0;
  schoolId: number = 0;
  degree: string = "";
  major: string = "";
  startDate: number = 1534438800;
  endDate: number = 1703264400;
  grade: number = 0;
  certificateImg: string = "";
  otherDesc: string = "";
  createdAt: string = "";
  updatedAt: string = "";
  name: string = "";
  shortName: string = "";
  schoolType: number = 0;
}
export const educationsSchema = {
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
  //
  // $$strict: true
}
