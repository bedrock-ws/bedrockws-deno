export default interface Response {
  header: Header;
  body: Body;
}

export interface Header {
  eventName: string;
  messagePurpose: string;
  requestId: string;
}

export type Body = unknown;
