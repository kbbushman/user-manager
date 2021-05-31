import { HTTP_CODES } from './../Shared/Model';
import { IncomingMessage, ServerResponse } from 'http';

export abstract class BaseRequestHandler {
  protected req: IncomingMessage;
  protected res: ServerResponse;

  public constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
  }

  abstract handleRequest(): Promise<void>;

  protected handleNotFound() {
    this.res.statusCode = HTTP_CODES.NOT_FOUND;
    this.res.write('Not Found');
  }

  protected respondJsonObject(code: HTTP_CODES, object: any) {
    this.res.writeHead(code, { 'Content-Type': 'application/json' });
    this.res.write(JSON.stringify(object));
  }

  protected respondBadRequest(message: string) {
    this.res.statusCode = HTTP_CODES.BAD_REQUEST;
    this.res.write(message);
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
