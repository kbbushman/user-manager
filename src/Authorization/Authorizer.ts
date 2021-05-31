import { TokenValidator, TokenRights, TokenState } from './../Server/Model';
import { SessionTokenDBAccess } from './SessionTokenDBAccess';
import { UserCredentialsDBAccess } from './UserCredentialsDBAccess';
import { Account, SessionToken, TokenGenerator } from '../Server/Model';

export class Authorizer implements TokenGenerator, TokenValidator {
  private userCredDBAccess: UserCredentialsDBAccess =
    new UserCredentialsDBAccess();
  private sessionTokenDBAccess: SessionTokenDBAccess =
    new SessionTokenDBAccess();

  async generateToken(account: Account): Promise<SessionToken | undefined> {
    const foundAccount = await this.userCredDBAccess.getUserCredentials(
      account.username,
      account.password
    );

    if (foundAccount) {
      const token: SessionToken = {
        accessRights: foundAccount.accessRights,
        expirationTime: this.generateExpirationTime(),
        username: foundAccount.username,
        valid: true,
        tokenId: this.generateRandomTokenId(),
      };

      await this.sessionTokenDBAccess.storeSessionToken(token);

      return token;
    } else {
      return undefined;
    }
  }

  public async validateToken(tokenId: string): Promise<TokenRights> {
    const token = await this.sessionTokenDBAccess.getToken(tokenId);
    if (!token || !token.valid) {
      return {
        accessRights: [],
        state: TokenState.INVALID,
      };
    } else if (token.expirationTime < new Date()) {
      return {
        accessRights: [],
        state: TokenState.EXPIRED,
      };
    }
    return {
      accessRights: token.accessRights,
      state: TokenState.VALID,
    };
  }

  private generateExpirationTime(): Date {
    return new Date(Date.now() + 60 * 60 * 1000);
  }

  private generateRandomTokenId(): string {
    return Math.random().toString(36).slice(2);
  }
}
