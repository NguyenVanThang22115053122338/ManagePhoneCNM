import type { IUser } from '../services/Interface';

export const normalizeUser = (raw: any): IUser => ({
  userId: raw.UserID ?? raw.userId,
  sdt: raw.SDT ?? raw.sdt,
  fullName: raw.FullName ?? raw.fullName,
  email: raw.Email ?? raw.email,
  address: raw.Address ?? raw.address,
  avatar: raw.Avatar ?? raw.avatar ?? null,
  role: raw.RoleID ?? raw.role,
  googleId: raw.googleId ?? null,
  createdAt: raw.CreatedAt,
  updatedAt: raw.UpdatedAt,
});
