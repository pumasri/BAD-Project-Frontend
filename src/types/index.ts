export type Role = 'student' | 'staff' | 'admin' | null;

export type ItemStatus =
  | 'OPEN'
  | 'MATCHED'
  | 'CLAIM_IN_PROGRESS'
  | 'RESOLVED'
  | 'DONATED'
  | 'DISPOSED'
  | 'ARCHIVED';

export type ReportType = 'LOST' | 'FOUND';

export interface User {
  id: string;
  fullName: string;
  universityEmail: string;
  role?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  reportType: ReportType;
  status: ItemStatus;
  categoryId: string;
  category?: Category;
  location: string;
  occurredAt: string;
  reportedAt: string;
  color?: string;
  brand?: string;
  isPublic: boolean;
  createdBy?: User;
  images?: {
    id: string;
    objectKey: string;
    mimeType: string;
    fileSize: number;
    reportId: string;
  }[];
}

export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFORMATION_REQUIRED';

export interface StudentClaim {
  id: string;
  foundReportId: string;
  foundReport?: Item;
  claimantUserId: string;
  claimant?: User;
  status: ClaimStatus;
  identifyingDetails: string;
  reviewNote?: string;
  createdAt: string;
  evidence?: ClaimEvidence[];
}

export interface ClaimEvidence {
  id: string;
  evidenceType: string;
  textValue?: string;
  objectKey?: string;
  mimeType?: string;
  fileSize?: number;
  createdAt: string;
  claimRequestId: string;
}

export type LoginPageConfig = {
  role: 'student' | 'staff' | 'admin';
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  showSignup?: boolean;
};
