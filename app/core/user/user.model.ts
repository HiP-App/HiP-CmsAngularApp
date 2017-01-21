import { Response } from '@angular/http';

/**
 * Model Class that represents a User
 */
export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  fullName: string;

  /**
   * Constructs an user from JSON response.
   *
   * @param res the response
   * @returns {User}
   */
  static extractData(res: Response): User {
    return User.parseJSON(res.json());
  }

  /**
   * Constructs an array of user from array JSON response.
   *
   * @param res the response
   * @returns {User[]|Array}
   */
  static extractPaginationedArrayData(res: Response): User[] {
    let body = res.json();
    let users: User[] = [];
    if (body.items !== undefined) {
      for (let user of body.items) {
        users.push(User.parseJSON(user));
      }
    }
    return users || [];
  }

  /**
   * Constructs an array of user from array JSON response.
   *
   * @param res the response
   * @returns {User[]|Array}
   */
  static extractArrayData(res: Response): User[] {
    let body = res.json();
    let users: User[] = [];
    if (body !== undefined) {
      for (let user of body) {
        users.push(User.parseJSON(user));
      }
    }
    return users || [];
  }

  /**
   * Use this method, if you need a dummy User
   * (for example if the real user is not available yet)
   * @returns {User}
   */
  static getEmptyUser() {
    return new User(-1, '', '', '', '', '');
  }

  /**
   * Construct user from JSON data.
   *
   * @param obj
   * @returns {User}
   */
  static parseJSON(obj: User) {
    return new User(obj.id, obj.email, obj.firstName, obj.lastName, obj.role, obj.fullName);
  }

  /**
   * Checks whether the given string is a valid email address.
   *
   * @param s a string to check
   * @returns {boolean} true if and only if s is a valid email address
   */
  public static validateEmail(s: string): boolean {
    return !!s.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/);
  }

  /**
   * Constructor for a User.
   * @param id
   * @param email
   * @param firstName
   * @param lastName
   * @param role ( Student | Supervisor | Admin )
   * @param fullName "firstName lastName"
   */
  constructor(id: number, email: string, firstName: string, lastName: string, role: string, fullName: string) {
    this.id = id;
    this.email = email;
    this.firstName = (firstName === null ? '' : firstName);
    this.lastName = (lastName === null ? '' : lastName);
    this.role = role;
    this.fullName = (fullName === null ? '' : fullName);
  }

  /**
   * Returns the user name. If no full name exists, the email address is returned.
   *
   * @returns {string} the user name
   */
  public displayName() {
    if (this.fullName !== '') {
      return this.fullName;
    }
    return this.email;
  }

  /**
   * Contructs the form data string from the user data.
   *
   * @returns {string} with form data
   */
  formData() {
    let data = '';
    data += 'id=' + this.id + '&';
    data += 'Email=' + this.email + '&';
    if (this.firstName !== '') {
      data += 'FirstName=' + this.firstName + '&';
    }
    if (this.lastName !== '') {
      data += 'LastName=' + this.lastName + '&';
    }
    data += 'Role=' + this.role + '&';
    if (this.lastName !== '' && this.lastName !== '') {
      data += 'FullName=' + this.firstName + ' ' + this.lastName;
    }
    return data;
  }
}
