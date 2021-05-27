import { Utils } from './Utils';
import { HTTP_METHODS, HTTP_CODES } from './../Shared/Model';
import { UserDBAccess } from './../User/UsersDBAccess';
import { IncomingMessage, ServerResponse } from 'http';
import { Handler } from "./Model";

export class UsersHandler implements Handler {
  private req: IncomingMessage;
  private res: ServerResponse;
  private usersDBAccess: UserDBAccess = new UserDBAccess();

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
  ) {
    this.req = req;
    this.res = res;
  }

  async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case  HTTP_METHODS.GET:
        this.handleGet();
        break;
    
      default:
        this.handleNotFound();
        break;
    }
  }

  private async handleGet() {
    const parsedUrl = Utils.getUrlParameters(this.req);
    console.log(parsedUrl?.get('id'));
    console.log(typeof parsedUrl);
  }

  private async handleNotFound() {
    this.res.statusCode = HTTP_CODES.NOT_FOUND;
    this.res.write('Not Found');
  }
}
