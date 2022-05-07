/* eslint-disable @typescript-eslint/no-inferrable-types */

/* eslint-disable lines-between-class-members */
export default class UserSchedules {
  id: string = "";
  userId: number = 0;
  dayOfWeek: number = 0;
  shiftId: number = 0;
  workingTimeFrom: number = 0;
  workingTimeTo: number = 0;
}
export const userSchedulesSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true },
        userId: { type: "number", optional: true },
        dayOfWeek: { type: "number", optional: true },
        shiftId: { type: "number", optional: true },
        workingTimeFrom: { type: "number", optional: true },
        workingTimeTo: { type: "number", optional: true },
        createdAt: { type: "string", optional: true },
        updatedAt: { type: "string", optional: true },
      }
    }
  }

}

