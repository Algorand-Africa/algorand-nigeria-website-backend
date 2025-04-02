export class ErrorResponse {
  error_message: string;
  error_code: number;

  constructor({
    error_message,
    error_code,
  }: {
    error_message: string;
    error_code: number;
  }) {
    this.error_message = error_message;
    this.error_code = error_code;
  }
}
