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
   * Use this method, if you need a dummy User
   * (for example if the real user is not available yet)
   * @returns {User}
   */
  static getEmptyUser() {
    return new User(-1, '', '', '', '', '');
  };

  static parseJSON(obj: User) {
    return new User(
      obj.id, obj.email,
      obj.firstName, obj.lastName,
      obj.role, obj.fullName);
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
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.fullName = fullName;
  }

  public displayName() {
    if (this.fullName !== '') {
      return this.fullName;
    }
    return this.email;
  }

}
