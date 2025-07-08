export default interface Request {
  header: Header;
  body: Body;
}

/** The header of a request. */
export interface Header {
  version: number;
  messageType: "commandRequest";
  messagePurpose: "subscribe" | "unsubscribe" | "commandRequest";

  /** UUID for identifying the response. */
  requestId: string;
}

export interface Body {}
