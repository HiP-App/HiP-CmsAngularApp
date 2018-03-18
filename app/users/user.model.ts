import { Response } from '@angular/http';

/**
 * Model Class that represents a User
 */
export class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[] = [];
  fullName: string;
  picture: string;
  studentDetails: StudentDetails;

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
  static extractPaginatedArrayData(res: Response): User[] {
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
    return new User('', '', '', '', [''], '');
  }

  /**
   * Construct user from JSON data.
   *
   * @param obj
   * @returns {User}
   */
  static parseJSON(obj: User) {
    let user = new User(obj.id, obj.email, obj.firstName, obj.lastName, obj.roles, obj.fullName);
    user.initStudentDetails(obj.studentDetails);
    return user;
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
   *
   * @param id
   * @param email
   * @param firstName
   * @param lastName
   * @param roles ( Student | Supervisor | Admin )
   * @param fullName "firstName lastName"
   */
  constructor(id: string, email: string, firstName: string, lastName: string, roles: string[], fullName: string) {
    this.id = id;
    this.email = email;
    this.firstName = (firstName === null ? '' : firstName);
    this.lastName = (lastName === null ? '' : lastName);
    this.roles = roles;
    this.fullName = (fullName === null ? '' : fullName);
    this.studentDetails = null;
  }

  /**
   * Initialize the student details.
   *
   * @param studentDetails the details for the student if the user's role is student
   */
  private initStudentDetails(studentDetails: any) {

    for (let role of this.roles) {
      if (role === 'Student') {
        let discipline = '';
        let currentDegree = '';
        let currentSemester = 0;
        if (studentDetails !== null) {
          if (studentDetails.discipline !== null) {
            discipline = studentDetails.discipline;
          }
          if (studentDetails.currentDegree !== null) {
            currentDegree = studentDetails.currentDegree;
          }
          if (studentDetails.currentSemester !== 0) {
            currentSemester = studentDetails.currentSemester;
          }
        }
        this.studentDetails = new StudentDetails(discipline, currentDegree, currentSemester);
      }
    }
  }

  /**
   * Returns the user name. If no full name exists, the email address is returned.
   *
   * @returns {string} the user name
   */
  public displayName() {
    if (this.fullName.trim() !== '') {
      return this.fullName;
    }
    return this.email;
  }
}

/**
 * Model for the student details
 */
export class StudentDetails {
  discipline: string;
  currentDegree: string;
  currentSemester: number;

  /**
   * Constructor for the student details
   *
   * @param discipline the discipline the student studies
   * @param currentDegree the degree (Bachelor or Master)
   * @param currentSemester the current semester
   */
  constructor(discipline: string, currentDegree: string, currentSemester: number) {
    this.discipline = discipline;
    this.currentDegree = currentDegree;
    this.currentSemester = currentSemester;
  }
}
