import { Server } from './Server/Server';

class Launcher {
  private server: Server;

  constructor() {
    this.server = new Server();
  }

  public launchApp() {
    console.log('App started...');
    this.server.createServer();
  }
}

new Launcher().launchApp();
