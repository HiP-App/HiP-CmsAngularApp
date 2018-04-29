import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {UserService} from './user.service';
import {PactWeb, Matchers} from '@pact-foundation/pact-web';

describe('UserService', () => {

  let provider;

  beforeAll(function (done) {
    provider = new PactWeb({
      consumer: 'ui',
      provider: 'userservice',
      port: 1234,
      host: '127.0.0.1',
    });

    // required for slower CI environments
    setTimeout(done, 2000);

    // Required if run with `singleRun: false`
    provider.removeInteractions();
  });

  afterAll(function (done) {
    provider.finalize()
    .then(function () {
      done();
    }, function (err) {
      done.fail(err);
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        UserService
      ],
    });
  });

  afterEach((done) => {
    provider.verify().then(done, e => done.fail(e));
  });

  describe('getUser()', () => {

    const expectedUser = 'auth0|5968ed8cdd1b3733ca94865d';

    const createdUserId = 42;

    beforeAll((done) => {
      provider.addInteraction({
        state: `provider accepts a userId`,
        uponReceiving: 'a request to GET user details using userId',
        withRequest: {
          method: 'GET',
          path: 'api/users',
          body: expectedUser,
          headers: {
            'Content-Type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          body: Matchers.somethingLike ({
            'id': 'auth0|5968ed8cdd1b3733ca94865d',
            'email': null,
            'firstName': 'HIP',
            'lastName': 'Admin',
            'fullName': 'Hip Admin',
            'studentDetails': null,
          'roles': [
            'Administrator'
          ],
          'profilePicture': 'https://docker-hip.cs.upb.de/develop/thumbnailservice/api/Thumbnails?Url=userstore/api/Media/auth0|5968ed8cdd1b3733ca94865d/File'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }).then(done, error => done.fail(error));
    });

    it('', (done) => {
      const userService: UserService = TestBed.get(UserService);
      userService.getUser(expectedUser).then(response => {
        expect(response).toEqual({
            'id': 'auth0|5968ed8cdd1b3733ca94865d',
            'email': null,
            'firstName': 'HIP',
            'lastName': 'Admin',
            'fullName': 'Hip Admin',
            'studentDetails': null,
          'roles': [
            'Administrator'
          ],
          'profilePicture': 'https://docker-hip.cs.upb.de/develop/thumbnailservice/api/Thumbnails?Url=userstore/api/Media/auth0|5968ed8cdd1b3733ca94865d/File'
        });
        done();
      });
    });
  });
});
