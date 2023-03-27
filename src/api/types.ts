export interface UserRole {
  id: number;
  name: string;
  description: string;
  type: string;
  //iso date string
  createdAt: string;
  //iso date string
  updatedAt: string;
  nb_users: number;
}
