export {};

declare global {
  // eslint-disable-next-line no-var -- It's fine to use `var` here.
  var __pgClient: Client;
}
