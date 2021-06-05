import { TokenValidator } from './Model';
import { Utils } from './Utils';
import { HTTP_METHODS, HTTP_CODES, AccessRight, User } from './../Shared/Model';
import { UserDBAccess } from './../User/UsersDBAccess';
import { IncomingMessage, ServerResponse } from 'http';
import { BaseRequestHandler } from './BaseRequestHandler';

export class UsersHandler extends BaseRequestHandler {
  private usersDBAccess: UserDBAccess = new UserDBAccess();
  private tokenValidator: TokenValidator;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
    tokenValidator: TokenValidator
  ) {
    super(req, res);
    this.tokenValidator = tokenValidator;
  }

  async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.GET:
        await this.handleGet();
        break;
      case HTTP_METHODS.PUT:
        await this.handlePut();
        break;
      default:
        this.handleNotFound();
        break;
    }
  }

  private async handlePut() {
    const operationAuthorized = await this.operationAuthorized(
      AccessRight.READ
    );

    if (operationAuthorized) {
      try {
        const user: User = await this.getRequestBody();
        await this.usersDBAccess.addUser(user);
        this.respondText(HTTP_CODES.CREATED, `User ${user.name} created`);
      } catch (err) {
        this.respondBadRequest(err.message);
      }
    } else {
      this.respondUnauthorized('Missing or invalid credentials');
    }
  }

  private async handleGet() {
    const operationAuthorized = await this.operationAuthorized(
      AccessRight.READ
    );

    if (operationAuthorized) {
      const parsedUrl = Utils.getUrlParameters(this.req);
      if (parsedUrl) {
        const userId = parsedUrl.get('id');
        if (userId) {
          const user = await this.usersDBAccess.getUserById(userId);
          if (user) {
            this.respondJsonObject(HTTP_CODES.OK, user);
          } else {
            this.handleNotFound();
          }
        } else {
          this.respondBadRequest(`User ID no provided in request`);
        }
      }
    } else {
      this.respondUnauthorized('Missing or invalid authentication');
    }
  }

  private async operationAuthorized(operation: AccessRight) {
    const tokenId = this.req.headers.authorization;
    if (tokenId) {
      const tokenRights = await this.tokenValidator.validateToken(tokenId);
      if (tokenRights.accessRights.includes(operation)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
