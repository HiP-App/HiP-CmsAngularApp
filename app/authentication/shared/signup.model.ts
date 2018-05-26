import { Response } from '@angular/http';

/**
 * This class represents a feature. Features can be organized in an hierarchy.
 * They can be enabled for FeatureGroups.
 */
export class Signup {
    firstname: string;
    lastname: string;
    email: string;
    password: string;

    /**
     * Constructor for a Feature.
     *
     * @param firstname the first name
     * @param lastname the last name
     * @param email the email-id of the user
     * @param password the password of the user
     */
    constructor(firstname: string,
                lastname: string,
                email: string,
                password: string) {
      this.firstname = firstname;
      this.lastname = lastname;
      this.email = email;
      this.password = password;
    }
  }
