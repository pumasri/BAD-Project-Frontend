import type { ItemStatus } from '../types';
import campusImageAsset from '../assets/images/abacCampus.jpeg';

export const campusImage = campusImageAsset;

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
export * from './api';
