export class Roles {
  public static get ADMIN(): string {
    return 'Administrator';
  }

  public static get STUDENT(): string {
    return 'Student';
  }

  public static get SUPERVISOR(): string {
    return 'Supervisor';
  }

  public static get ROLES(): string[] {
    return [ Roles.ADMIN, Roles.STUDENT, Roles.SUPERVISOR ];
  }
}
