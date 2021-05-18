import { Utils } from './../Server/Utils';
import { createServer, IncomingMessage, ServerResponse } from 'http';

export class Server {
  public createServer() {
    createServer((req: IncomingMessage, res: ServerResponse) => {
      console.log(`Request from: ${req.url}`);
      const basePath = Utils.getUrlBasePath(req);
      console.log('Base Path =', basePath);
      res.end();
    }).listen(4000);

    console.log('Server listening on port 4000');
  }
}
