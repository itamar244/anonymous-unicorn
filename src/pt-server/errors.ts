export class PtError extends Error {
  constructor(public statusCode: number, message: string, public meta?: object) {
    super(message);
  }
}
