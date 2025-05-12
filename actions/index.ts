'use server';

import { axiosInstance } from '@/lib/utils';
import type { Article, ResponseApi, User } from '@/types';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export const getArticles = async (currentPage: number, limit?: number) => {
  const { data } = await axiosInstance.get<ResponseApi<Article[]>>(
    `/api/articles?limit=${limit || 9}&page=${currentPage}`
  );
  return data;
};

export const getArticleById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get<Article>(`/api/articles/${id}`);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getCategories = async (currentPage: number) => {
  try {
    const { data } = await axiosInstance.get(`/api/categories?page=${currentPage}`);
    return data ?? [];
  } catch (error) {
    console.error(error);
  }
};

export const findArticleByTitle = async (title: string, categoryId?: string) => {
  const { data } = await axiosInstance.get<ResponseApi<Article[]>>(
    `/api/articles?limit=9&title=${title}&category=${categoryId}`
  );
  return data;
};

export const findCategoryByName = async (name: string) => {
  const { data } = await axiosInstance.get(`/api/categories?search=${name}`);
  return data;
};

export const getProfile = async () => {
  const { get } = await cookies();
  if (!get('token')) return;

  const { data } = await axiosInstance.get<User>('/api/auth/profile', {
    headers: {
      Authorization: `Bearer ${get('token')?.value}`,
    },
  });
  return data;
};

export const setCookie = async (name: string, value: string) => {
  const { set } = await cookies();
  set(name, value, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
};

export const logout = async () => {
  const { delete: deleteCookie } = await cookies();
  deleteCookie('token');
  deleteCookie('role');
};

export const deleteArticle = async (id: string) => {
  try {
    const { get } = await cookies();
    if (!get('token')) return;

    await axiosInstance.delete(`/api/articles/${id}`, {
      headers: {
        Authorization: `Bearer ${get('token')?.value}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateArticle = async (id: string, data: any) => {
  try {
    const { get } = await cookies();
    if (!get('token')) return;

    await axiosInstance.put(
      `/api/articles/${id}`,
      {
        title: data.title,
        content: data.content,
        categoryId: data.category,
      },
      {
        headers: {
          Authorization: `Bearer ${get('token')?.value}`,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

export const createArticle = async (data: any) => {
  try {
    const { get } = await cookies();
    if (!get('token')) return;

    await axiosInstance.post(
      '/api/articles',
      {
        title: data.title,
        content: data.content,
        categoryId: data.category,
      },
      {
        headers: {
          Authorization: `Bearer ${get('token')?.value}`,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

export const createCategory = async (data: { name: string }) => {
  try {
    const { get } = await cookies();
    if (!get('token')) return;
    await axiosInstance.post(
      '/api/categories',
      {
        name: data.name,
      },
      {
        headers: {
          Authorization: `Bearer ${get('token')?.value}`,
        },
      }
    );
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const { get } = await cookies();
    if (!get('token')) return;

    await axiosInstance.delete(`/api/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${get('token')?.value}`,
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
};

export const updateCategory = async (id: string, data: { name: string }) => {
  try {
    const { get } = await cookies();
    if (!get('token')) return;

    await axiosInstance.put(
      `/api/categories/${id}`,
      {
        name: data.name,
      },
      {
        headers: {
          Authorization: `Bearer ${get('token')?.value}`,
        },
      }
    );
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
};
