const hasCaptureStackTrace = 'captureStackTrace' in Error

export class ResponseError extends Error {
  constructor (message, status, details) {
    super(message);
    this.message = message;
    this.details = details;

    if (hasCaptureStackTrace)
      Error.captureStackTrace(this, constructor)

    // Set the name and message depending on the response status
    // http://httpstatus.es/
    switch (status) {
      case 400:
        this.name = "Validation Error";
      default:
        break;
    }
  }
}