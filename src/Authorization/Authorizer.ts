import { UserCredentialsDBAccess } from './UserCredentialsDBAccess';
import { Account, SessionToken, TokenGenerator } from '../Server/Model';

export class Authorizer implements TokenGenerator {
  private userCredDBAccess: UserCredentialsDBAccess =
    new UserCredentialsDBAccess();

  async generateToken(account: Account): Promise<SessionToken | undefined> {
    const foundAccount = await this.userCredDBAccess.getUserCredentials(
      account.username,
      account.password
    );

    if (foundAccount) {
      return { tokenId: 'sometokenid' };
    } else {
      return undefined;
    }
  }
}
