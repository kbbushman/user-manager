import { URL } from 'url';
import { IncomingMessage } from 'http';

export class Utils {
  public static getUrlBasePath(req: IncomingMessage): string {
    if (req && req.url) {
      const baseUrl = `http://${req.headers.host}/`;
      const parsedUrl = new URL(req.url, baseUrl);
      return parsedUrl.pathname.split('/')[1];
    }

    return '';
  }
}
