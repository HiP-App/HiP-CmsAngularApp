export type contentStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED';

export abstract class ContentStatus {
  public static readonly values = ['DRAFT', 'IN_REVIEW', 'PUBLISHED'];
}
