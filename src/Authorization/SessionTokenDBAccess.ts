import { SessionToken } from './../Server/Model';
import * as Nedb from 'nedb';

export class SessionTokenDBAccess {
  private nedb: Nedb;

  constructor() {
    this.nedb = new Nedb('database/SessionToken.db');
    this.nedb.loadDatabase();
  }

  public async storeSessionToken(token: SessionToken): Promise<void> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(token, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async getToken(tokenId: string): Promise<SessionToken | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find({ tokenId }, (err: Error, docs: any) => {
        if (err) {
          reject(err);
        } else {
          if (docs.length === 0) {
            resolve(undefined);
          } else {
            resolve(docs[0]);
          }
        }
      });
    });
  }
}
