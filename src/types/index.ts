export type Role = 'student' | 'staff' | 'admin' | null;

export type ItemStatus =
  | 'OPEN'
  | 'MATCHED'
  | 'CLAIM_IN_PROGRESS'
  | 'RESOLVED'
  | 'DONATED'
  | 'DISPOSED'
  | 'ARCHIVED';

export type Item = {
  id: number;
  name: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image?: string;
  status: ItemStatus;
};

export type LoginPageConfig = {
  role: 'student' | 'staff' | 'admin';
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  showSignup?: boolean;
};

export type StudentClaim = {
  id: number;
  item: string;
  category: string;
  status: string;
  date: string;
  location?: string;
  description?: string;
};
