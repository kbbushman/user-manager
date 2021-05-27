import { URL, URLSearchParams } from 'url';
import { IncomingMessage } from 'http';

export class Utils {
  private static getBaseUrl(req: IncomingMessage): string {
    return `http://${req.headers.host}/`;
  }

  public static getUrlBasePath(req: IncomingMessage): string {
    if (req && req.url) {
      const parsedUrl = new URL(req.url, this.getBaseUrl(req));
      return parsedUrl.pathname.split('/')[1];
    }

    return '';
  }

  public static getUrlParameters(req: IncomingMessage): URLSearchParams | undefined {
    if (req && req.url) {
      return new URL(req.url, this.getBaseUrl(req)).searchParams;
    } else {
      return undefined;
    }
  }
}
