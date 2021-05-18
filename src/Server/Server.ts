import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Utils } from './../Server/Utils';
import { LoginHandler } from './../Server/LoginHandler';

export class Server {
  public createServer() {
    createServer(async (req: IncomingMessage, res: ServerResponse) => {
      console.log(`Request from: ${req.url}`);
      const basePath = Utils.getUrlBasePath(req);

      switch (basePath) {
        case 'login':
          await new LoginHandler(req, res).handleRequest();
          break;

        default:
          break;
      }

      res.end();
    }).listen(4000);

    console.log('Server listening on port 4000');
  }
}
