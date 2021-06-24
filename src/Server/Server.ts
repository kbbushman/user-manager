import { UsersHandler } from './UsersHandler';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Utils } from './../Server/Utils';
import { LoginHandler } from './../Server/LoginHandler';
import { Authorizer } from '../Authorization/Authorizer';

export class Server {
  private authorizer: Authorizer = new Authorizer();

  public createServer() {
    createServer(async (req: IncomingMessage, res: ServerResponse) => {
      console.log(`Request from: ${req.url}`);
      this.addCorsHeader(res);
      const basePath = Utils.getUrlBasePath(req);

      switch (basePath) {
        case 'login':
          await new LoginHandler(req, res, this.authorizer).handleRequest();
          break;
        case 'users':
          await new UsersHandler(req, res, this.authorizer).handleRequest();
          break;
        default:
          break;
      }

      res.end();
    }).listen(4000);

    console.log('Server listening on port 4000');
  }

  private addCorsHeader(res: ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}
