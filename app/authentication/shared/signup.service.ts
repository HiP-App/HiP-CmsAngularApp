// import { User } from './../../users/user.model';
// import { UserStoreApiService } from './../../shared/api/userstore-api.service';

// /**
//  * Service which does feature toggle related api calls
//  */
// @Injectable()
// export class FeatureService {
//     constructor(private userStoreApiService: UserStoreApiService) {}
//     /**
//    * Creates a new user.
//    *
//    * @param user the user to save
//    */
//   public createUser(user: User) {
//     return this.userStoreApiService.postUrl('/Api/Users', JSON.stringify(user), {})
//       .toPromise()
//       .then(
//         (response: Response) => {
//           return response.status === 200;
//         }
//       ).catch(
//         (error: any) => UserStoreApiService.handleError(error)
//       );
//   }
// }
