import { ItemStatus } from '../types';

export const campusImage = '/abacCampus.jpeg';

export function formatStatus(status: ItemStatus) {
  const statusNames: Record<ItemStatus, string> = {
    OPEN: 'Available',
    MATCHED: 'Potential Match',
    CLAIM_IN_PROGRESS: 'Under Review',
    RESOLVED: 'Returned',
    DONATED: 'Donated',
    DISPOSED: 'Disposed',
    ARCHIVED: 'Archived',
  };

  return statusNames[status];
}
