import { Response } from '@angular/http';

export class Signup {
    firstname: string;
    lastname: string;
    email: string;
    password: string;

    /**
     * Constructor for signing up a new user.
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
