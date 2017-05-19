export type statusType = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED';

/**
 * Model for the status of routes, exhibits, exhibit pages, media and tags.
 */
export class Status {

  /**
   * Returns an array of status values.
   *
   * @returns an array containing all possible status values
   */
  static getStatusValues() {
    return ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ANY_STATUS'].sort();
  }

}
