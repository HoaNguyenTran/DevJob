/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable lines-between-class-members */
export default class Experiences{
  id : number | undefined = undefined;
  userId : number | undefined = undefined;
  categoryId : number | undefined = undefined;
  experienceId : number | undefined = undefined;
  note: string = "";
}
export const ExperiencesSchema = {
  id : { type: "number", optional: true, nullable: true },
  userId : { type: "number", optional: true, nullable: true },
  categoryId : { type: "number", optional: true, nullable: true },
  experienceId : { type: "number", optional: true, nullable: true },
  note: { type: "string", max: 200, optional: true, nullable: true },
  createdAt: { type: "date", optional: true, nullable: true },
  updatedAt: { type: "date", optional: true, nullable: true },
  //
  $$strict: true
}
