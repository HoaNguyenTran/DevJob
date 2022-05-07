/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable lines-between-class-members */
export default class profSkills{
  id : number | undefined = undefined;
  userId : number | undefined = undefined;
  profSkillId : number | undefined = undefined;
  experience : number | undefined = undefined;
  note: string = "";
  createdAt: string = "";
  updatedAt : string = "";
}
export const profSkillsSchema = {
  id : { type: "number", integer: true, optional: true, nullable: true },
  userId : { type: "number", integer: true, optional: true, nullable: true },
  profSkillId : { type: "number", integer: true, optional: true, nullable: true },
  experience : { type: "number", integer: true, optional: true, nullable: true },
  note: { type: "string",  optional: true, nullable: true },
  createdAt: { type: "date", optional: true, nullable: true },
  updatedAt: { type: "date", optional: true, nullable: true },
  //
  $$strict: true
}
