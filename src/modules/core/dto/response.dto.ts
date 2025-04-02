export class GenericResponse<T> {
  status?: number;
  message: string;
  data?: T;

  constructor({
    status,
    message,
    data,
  }: {
    status?: number;
    message: string;
    data?: T;
  }) {
    this.status = status || 200;
    this.message = message;
    this.data = data;
  }
}
