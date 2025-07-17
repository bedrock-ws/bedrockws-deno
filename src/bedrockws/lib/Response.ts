export class Response {
  data: ResponseData;

  constructor(data: ResponseData) {
    this.data = data;
  }

  get ok(): boolean {
    return this.data.body.statucCode >= 0;
  }
}

export interface ResponseData {
  header: Header;
  body: Body;
}

export interface Header {
  eventName: string;
  messagePurpose: string;
  requestId: string;
}

export type Body = any; // TODO: prefer JsonValue or use zod
