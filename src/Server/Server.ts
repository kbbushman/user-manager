import { createServer, IncomingMessage, ServerResponse } from 'http';

export class Server {
  public createServer() {
    createServer((req: IncomingMessage, res: ServerResponse) => {
      console.log(`Request from: ${req.url}`);
      res.end();
    }).listen(4000);

    console.log('Server listening on port 4000');
  }
}
