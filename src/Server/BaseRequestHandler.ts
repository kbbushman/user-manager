import { HTTP_CODES } from './../Shared/Model';
import { IncomingMessage, ServerResponse } from 'http';

export abstract class BaseRequestHandler {
  protected req: IncomingMessage;
  protected res: ServerResponse;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
  ) {
    this.req = req;
    this.res = res;
  }

  abstract handleRequest(): Promise<void>
   
  protected async handleNotFound() {
    this.res.statusCode = HTTP_CODES.NOT_FOUND;
    this.res.write('Not Found');
  }

  protected async getRequestBody(): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      this.req.on('data', (data: string) => {
        body += data;
      });
      this.req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
      this.req.on('error', (error: any) => {
        reject(error);
      });
    });
  }
}