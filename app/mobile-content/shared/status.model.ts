export type statusType = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED';

/**
 * Model for the status of routes, exhibits, exhibit pages, media and tags.
 */
export abstract class Status {

  /**
   * Returns an array of possible status values.
   *
   * @returns an array containing all possible status values
   */
  static getValues() {
    return ['DRAFT', 'InReview', 'Published'];
  }

  /**
   * Returns an array of status values that can be used to filter search results.
   * Useful for ngFor directives in search options.
   *
   * @returns an array of possible status values + value represenging any status
   */
  static getValuesForSearch() {
    return ['ALL'].concat(Status.getValues());
  }
}
