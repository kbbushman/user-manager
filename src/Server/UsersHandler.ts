import { Utils } from './Utils';
import { HTTP_METHODS, HTTP_CODES } from './../Shared/Model';
import { UserDBAccess } from './../User/UsersDBAccess';
import { IncomingMessage, ServerResponse } from 'http';
import { BaseRequestHandler } from './BaseRequestHandler';

export class UsersHandler extends BaseRequestHandler {
  private usersDBAccess: UserDBAccess = new UserDBAccess();

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
  ) {
    super(req, res);
  }

  async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case  HTTP_METHODS.GET:
        await this.handleGet();
        break;
    
      default:
        this.handleNotFound();
        break;
    }
  }

  private async handleGet() {
    const parsedUrl = Utils.getUrlParameters(this.req);
    if (parsedUrl) {
      const userId = parsedUrl.get('id');
      const user = await this.usersDBAccess.getUserById(userId as string);
      if (user) {
        this.res.writeHead(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
        this.res.write(JSON.stringify(user));
      } else {
        this.handleNotFound();
      }
    }
  }
}
