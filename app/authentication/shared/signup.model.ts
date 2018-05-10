// import { Response } from '@angular/http';

// /**
//  * This class represents a feature. Features can be organized in an hierarchy.
//  * They can be enabled for FeatureGroups.
//  */
// export class Feature {
//     fname: string;
//     lname: string;
//     email: string;
//     password: string;

//     /**
//      * Constructor for a Feature.
//      *
//      * @param fname the first name
//      * @param lname the last name
//      * @param email the email-id of the user
//      * @param password the password of the user
//      */
//     constructor(fname: string,
//                 lname: string,
//                 email: string,
//                 password: string) {
//       this.fname = fname;
//       this.lname = lname;
//       this.email = email;
//       this.password = password;
//     }

//     /**
//      * Extract features from a JSON array containing features.
//      *
//      * @param res the response
//      * @returns {Feature[]} an array of features
//      */
//     public static extractData(res: Response): Feature[] {
//       let body = res.json();
//       let features: Feature[] = [];
//       for (let featureData of body) {
//         features.push(featureData);
//       }
//       return features;
//     }

//     /**
//      * Returns a dummy {Feature} object.
//      *
//      * @returns {Feature}
//      */
//     public static emptyFeature(): Feature {
//       return new Feature(-1, '', null, [], []);
//     }

//     public isValid(): boolean {
//       return this.name.trim().length > 2;
//     }
//   }
