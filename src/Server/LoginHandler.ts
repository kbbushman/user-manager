import { HTTP_CODES, HTTP_METHODS } from './../Shared/Model';
import { IncomingMessage, ServerResponse } from 'http';
import { Account, Handler, TokenGenerator } from './Model';

export class LoginHandler implements Handler {
  private req: IncomingMessage;
  private res: ServerResponse;
  private tokenGenerator: TokenGenerator;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
    tokenGenerator: TokenGenerator
  ) {
    this.req = req;
    this.res = res;
    this.tokenGenerator = tokenGenerator;
  }

  public async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.POST:
        await this.handlePost();
      default:
        this.handleNotFound();
    }
  }

  private async handleNotFound() {
    this.res.statusCode = HTTP_CODES.NOT_FOUND;
    this.res.write('Not Found');
  }

  private async handlePost() {
    try {
      const body = await this.getRequestBody();
      const sessionToken = await this.tokenGenerator.generateToken(body);
      if (sessionToken) {
        this.res.statusCode = HTTP_CODES.CREATED;
        this.res.writeHead(HTTP_CODES.CREATED, {
          'Content-Type': 'application/json',
        });
        this.res.write(JSON.stringify(sessionToken));
      } else {
        this.res.statusCode = HTTP_CODES.NOT_FOUND;
        this.res.write('Invalid username and/or password');
      }
    } catch (err) {
      this.res.write('Error: ' + err.message);
    }
  }

  private async getRequestBody(): Promise<Account> {
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
