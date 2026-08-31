export type Role = 'STUDENT' | 'STAFF' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

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

export type MatchConfidence = 'HIGH' | 'POSSIBLE';
export type MatchStatus = 'SUGGESTED' | 'CONFIRMED' | 'REJECTED' | 'CLAIMED' | 'RESOLVED';

export interface StudentSuggestedMatch {
  id: string;
  score: number;
  confidence: MatchConfidence;
  status: MatchStatus;
  reasons: string[];
  foundItem: {
    category: string | null;
    approximateLocation: string;
    approximateDate: string;
  };
}

export interface MatchScores {
  totalScore: number;
  descriptionSimilarityScore: number;
  categoryScore: number;
  colorScore: number;
  locationScore: number;
  dateScore: number;
}

export interface MatchDetail extends MatchScores {
  id: string;
  confidence: MatchConfidence;
  reasons: string[];
  status: MatchStatus;
  matchSource: string;
  reviewedAt?: string | null;
  createdAt: string;
  lostReportId: string;
  foundReportId: string;
  lostReport: Item;
  foundReport: Item;
  reviewer?: { id: string; fullName: string } | null;
}
