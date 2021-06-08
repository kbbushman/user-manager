import { User } from './../Shared/Model';
import * as Nedb from 'nedb';

export class UserDBAccess {
  private nedb: Nedb;

  constructor() {
    this.nedb = new Nedb('database/Users.db');
    this.nedb.loadDatabase();
  }

  public async addUser(user: User): Promise<void> {
    if (!user.id) {
      user.id = this.generateUserId();
    }
    return new Promise((resolve, reject) => {
      this.nedb.insert(user, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async getUserById(userId: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find({ id: userId }, (err: Error, results: any[]) => {
        if (err) {
          reject(err);
        } else {
          if (results.length === 0) {
            resolve(undefined);
          } else {
            resolve(results[0]);
          }
        }
      });
    });
  }

  public async getUsersByName(name: string): Promise<User[]> {
    const regEx = new RegExp(name);
    return new Promise((resolve, reject) => {
      this.nedb.find({ name: regEx }, (err: Error, results: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  private generateUserId() {
    return Math.random().toString(36).slice(2);
  }
}
