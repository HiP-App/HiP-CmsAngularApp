/**
 * Model Class that represents a User
 */

export class User {
  private _id: number;
  private _email: string;
  private _firstName: string;
  private _lastName: string;
  private _role: string;
  private _fullName: string;

  get id(): number {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
    this._fullName = this._firstName + ' ' + this._lastName;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
    this._fullName = this._firstName + ' ' + this._lastName;
  }

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }

  get fullName(): string {
    return this._fullName;
  }

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
    this._id = id;
    this._email = email;
    this._firstName = firstName;
    this._lastName = lastName;
    this._role = role;
    this._fullName = fullName;
  }

  public displayName() {
    if (this._fullName !== '') {
      return this.fullName;
    }
    return this.email;
  }

}
