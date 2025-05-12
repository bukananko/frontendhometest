export type Category = {
  id: string;
  name: string;
  userId?: string;
  createdAt?: Date;
};

export type Article = {
  id?: string;
  title: string;
  content: string;
  userId?: string;
  categoryId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
  category?: Category;
  user?: User;
};

export type User = {
  id: string;
  username: string;
  role: 'User' | 'Admin';
};

export type ResponseApi<T> = {
  data: T;
  total: number;
  limit: number;
  page: number;
};
