/** Turns an event name from camel case into pacal case. */
export function eventNameAsPascalCase(eventName: string): string {
  return eventName[0].toUpperCase() + eventName.slice(1);
}

/** Turns an event name from pascal case into camel case. */
export function eventNameAsCamelCase(eventName: string): string {
  return eventName[0].toLowerCase() + eventName.slice(1);
}
