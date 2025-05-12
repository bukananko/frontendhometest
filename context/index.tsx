'use client';

import { getCategories, getProfile } from '@/actions';
import { Article, Category, User } from '@/types';
import { createContext, useEffect, useState } from 'react';

type ContextType = {
  articles: {
    data: Article[];
    total: number;
    limit: number;
    page: number;
    isSearched: boolean;
  };
  setArticles: React.Dispatch<React.SetStateAction<ContextType['articles']>>;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  categories: {
    data: Category[];
    totalData: number;
    totalPages: number;
    currentPage: number;
    isSearched: boolean;
  };
  setCategories: React.Dispatch<React.SetStateAction<ContextType['categories']>>;
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
};

export const GlobalContext = createContext({} as ContextType);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState({
    data: [],
    total: 0,
    limit: 0,
    page: 0,
    isSearched: false,
  } as ContextType['articles']);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [categories, setCategories] = useState({
    data: [] as Category[],
    totalData: 0,
    totalPages: 0,
    currentPage: 0,
    isSearched: false,
  });
  const [currentUser, setCurrentUser] = useState({} as User);

  useEffect(() => {
    (async () => {
      const data = await getCategories(1);
      setCategories({ ...data, isSearched: false });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      setCurrentUser(data!);
    })();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ articles, setArticles, isSearching, setIsSearching, categories, setCategories, currentUser, setCurrentUser }}>
      {children}
    </GlobalContext.Provider>
  );
}
