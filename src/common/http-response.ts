export interface StandardHttpResponse<T> {
  data: T | null;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

export class HttpResponse {
  static success<T>(
    data: T,
    message = 'Success',
    statusCode = 200,
    path?: string,
  ): StandardHttpResponse<T> {
    return {
      data,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: path ?? '',
    };
  }

  static error(
    message = 'Internal Server Error',
    statusCode = 500,
    path?: string,
  ): StandardHttpResponse<null> {
    return {
      data: null,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: path ?? '',
    };
  }
}
