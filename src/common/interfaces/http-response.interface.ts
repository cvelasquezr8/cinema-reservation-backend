export interface StandardHttpResponse<T> {
  data: T | null;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}
