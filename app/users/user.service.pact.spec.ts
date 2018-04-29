import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {UserService} from './user.service';
import {User} from './user';
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

  describe('create()', () => {

    const expectedUser: User = {
      userId: 'auth0|5968ed8cdd1b3733ca94865d';
    };

    const createdUserId = 42;

    beforeAll((done) => {
      provider.addInteraction({
        state: `provider accepts a new person`,
        uponReceiving: 'a request to POST a person',
        withRequest: {
          method: 'POST',
          path: '/user-service/users',
          body: expectedUser,
          headers: {
            'Content-Type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          body: Matchers.somethingLike({
            id: 'auth0|5968ed8cdd1b3733ca94865d',
            email: null,
            firstName: 'HIP',
            lastName: 'Admin',
            fullName: 'Hip Admin',
            studentDetails: null,
          roles: [
            'Administrator'
          ],
          ProfilePicture: 'https://docker-hip.cs.upb.de/develop/thumbnailservice/api/Thumbnails?Url=userstore/api/Media/auth0|5968ed8cdd1b3733ca94865d/File');
        }
      }).then(done, error => done.fail(error));
    });

    it('should create a Person', (done) => {
      const userService: UserService = TestBed.get(UserService);
      userService.getUser(expectedUser).then(response => {
        expect(response).toEqual(createdUserId);
        done();
      }, error => {
        done.fail(error);
      });
    });
  });
});
