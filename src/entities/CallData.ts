/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

class CallDataBase {
  uuid: string  = "";
  // calleeName? = "";
  // calleeAvatar?= "";
  callerId? : number = 0;
  callerName?: string = "";
  callerAvatar?: string = "";
  handle: string  = "FJob";
  channelName?: string = "";
  video = true;
}
export default class CallData extends CallDataBase {
  calleeId? : number = 0;

}

export class ContactERData extends CallDataBase {
  jobId? : number = 0;
  jobInfo?: string = "";
}

export class ContactEEData extends CallDataBase {
  jobId? : number = 0;
  calleeId? : number = 0;
  jobInfo?: string = "";
}

export class CallUpdateData {
  uuid : string = "";
  userId  : number = 0;
  status : number  = 1;
  type : number  = 1;
}
