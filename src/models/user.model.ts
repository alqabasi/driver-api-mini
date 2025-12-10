export interface User {
  id: string;
  fullName: string;
  shortName: string;
  mobile: string;
  password_hash: string;
  role: 'admin' | 'viewer' | 'driver';
  active: boolean;
  createdAt: Date;
}
