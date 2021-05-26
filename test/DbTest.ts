import { UserDBAccess } from './../src/User/UsersDBAccess';
import { UserCredentialsDBAccess } from './../src/Authorization/UserCredentialsDBAccess';

class DbTest {
  public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
  public userDbAccess: UserDBAccess = new UserDBAccess();
}

// new DbTest().dbAccess.putUserCredentials({
//   username: 'user1',
//   password: '1234',
//   accessRights: [1, 2, 3],
// });

new DbTest().userDbAccess.addUser({
  age: 22,
  email: 'jdoe@gmail.com',
  id: '2804yshjd',
  name: 'John Doe',
  workingPosition: 3,
});
